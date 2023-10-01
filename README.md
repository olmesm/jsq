# JSQ - JQ Javascript

> WIP. I'm exploring this as a concept right now. See [goals](#goals)

JQ is a brilliant tool but having to lookup the syntax everytime I use it is pretty cumbersome. Javascript is pretty flexible, well known, and allows for a functional flavour.

The purpose is to make a more intuitive JQ, although this may come at the expense of succinctness.

## Goals

- binary executable/easy install
- easy syntax
- startup speed
- bundle size - we'll never beat jq here, but <100mb would work.
- aim to allow for succinct scripting

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

## Development

```bash
# Install asdf tooling
curl -sL https://raw.githubusercontent.com/olmesm/odd-scripts/main/shell/asdf-install.sh | bash

# For countries API
npm run poc

# Custom Blobs
echo '{"some-json": "blob"}' | npm start

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
