#!/bin/bash

# Extract dependencies from package.json
dependencies=$(jq -r '.dependencies | keys[]' package.json)

# Install dependencies one by one
for package in $dependencies
do
  echo "Installing $package..."
  npm install $package
done

# Extract devDependencies from package.json
devDependencies=$(jq -r '.devDependencies | keys[]' package.json)

# Install devDependencies one by one
for package in $devDependencies
do
  echo "Installing $package..."
  npm install --save-dev $package
done