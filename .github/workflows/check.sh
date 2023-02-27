#!/bin/sh

set -e

# Install
yarn

# Depcheck
yarn depcheck

# Lint
yarn prettier

# Test
yarn predocs
yarn docs

# Build
yarn build
