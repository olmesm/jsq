# JSQ - JQ Javascript

> WIP. I'm exploring this as a concept right now. See [goals](#goals) for more details.
> Next up: CICD for binary releases and tests.

JQ is a brilliant tool but having to lookup the syntax everytime you use it sucks. Javascript is pretty flexible, well known, and allows for a functional flavour.

JSQ aims to be a more intuitive and maintainable JQ, sacrificing binary size and potentially succinctness.

## Goals

- easy syntax
- binary executable
- startup speed
- bundle size - we'll never beat jq here, <75mb should be fine.
- succinct expressions

## Usage

A number of libraries are bundled to help allow for expressive function expressions.

| Library   | Template Variable | Documentation                                    |
| --------- | ----------------- | ------------------------------------------------ |
| lodash    | `_.<...>`         | <https://lodash.com/docs>                        |
| lodash/fp | `f.<...>`         | <https://github.com/lodash/lodash/wiki/FP-Guide> |
| Ramdax    | `r.<...>`         | <https://selfrefactor.github.io/rambdax>         |

It's suggested to construct expressions using the library/libraries that are the most understandable or used within your team.

```bash
# Lodash => `_.`
$ echo '{"some-json": "blob"}' | jsq '(input) => _.get(input, "some-json")'
blob

# Lodash/fp => `f`
$ echo '{"some-json": "blob"}' | jsq '(input) => f.get("some-json", input)'
blob
# Shorthand
$ echo '{"some-json": "blob"}' | jsq 'f.get("some-json")'
blob

# Ramdax => `r.`
$ echo '{"some-json": "blob"}' | jsq '(input) => r.path("some-json", input)'
blob
# Shorthand
$ echo '{"some-json": "blob"}' | jsq 'r.path("some-json")'
blob
```

An array of functions will apply the result of the previous function and original object to each function.

```bash
$ echo '{"some-json": "blob"}' | jsq '[r.path("some-json"), (previous, original) => [previous, original]]'
[
  "blob",
  {
    "some-json": "blob"
  }
]

# expands to...
$ echo '{"some-json": "blob"}' | jsq '(input) => {
  const fn1 = (previous, original) => r.path("some-json")(previous, original)
  const fn2 = (previous, original) => [previous, original]

  const r1 = fn1(input, input)
  const r2 = fn2(r1, input)

  return r2
}'
[
  "blob",
  {
    "some-json": "blob"
  }
]
```

Not recommended, but mixing and matching libraries is also possible

```bash
curl -s https://restcountries.com/v3.1/all | jsq 'r.map(r.path("name.common"))'
[ "French Polynesia", "Saint Martin", "Venezuela", "Réunion", ... ]

curl -s https://restcountries.com/v3.1/all | jsq '[o => _.map(o, f.get("name.common")), f.map(r.head)]'
[
  "F", # from "French Polynesia"
  "S", # from "Saint Martin"
  "V", # from "Venezuela"
  "R", # from "Réunion"
  ...
]
```

## Development

```bash
# Install asdf tooling
curl -sL https://raw.githubusercontent.com/olmesm/odd-scripts/main/shell/asdf-install.sh | bash

# For countries API
npm run poc -- '<function expression>'
# npm run poc -- 'r.map(r.path("name.common"))'

# Custom Blobs
echo '{"some-json": "blob"}' | npm start -- '<function expression>'
# echo '{"some-json": "blob"}' | npm start -- 'r.path("some-json")'

# Build
npm run build

# Check bundle size
ls -lh ./dist
```

## Notes

- [Git diffing bun lockfiles](https://bun.sh/docs/install/lockfile)

  ```
  git config diff.lockb.textconv bun
  git config diff.lockb.binary true
  ```
