#!/bin/sh

set -e

# Install
yarn

# Depcheck
yarn depcheck

# Lint
yarn prettier

# Tests
yarn test

# Test
yarn predocs
yarn docs

# Build
yarn build
