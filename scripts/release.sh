#!/usr/bin/env bash

RELEASE_NOTES="$1"
VERSION=$(npm pkg get version | tr -d '"')

if [[ $(git status --porcelain) ]]; then
  echo "[ERROR] Please ensure the branch is clean and pushed to main"
  exit 1
fi

if [[ ! "${VERSION}" ]]; then
  echo "[ERROR] Could not get version from package.json"
  exit 1
fi

if [[ ! "${RELEASE_NOTES}" ]]; then
  echo "[ERROR] Please enter a RELEASE_NOTES in the form of a \"string\""
  exit 1
fi

git tag -a -m "$RELEASE_NOTES" "v$VERSION"

git push --follow-tags