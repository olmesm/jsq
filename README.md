# JSQ - JQ Javascript

> WIP. I'm exploring this as a concept right now. See [goals](#goals)

JQ is a brilliant tool but having to lookup the syntax everytime I use it is pretty cumbersome. Javascript is pretty flexible, well known, and allows for a functional flavour.

The purpose is to make a more intuitive JQ, although this may come at teh expense of succintness.

## Goals

- binary executable/easy install
- easy syntax
- startup speed
- bundle size
- aim to allow for succinct scripting

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
