#!/bin/bash

rm build.zip

zip -r \
 build.zip . \
 -x ".git/*" "node_modules/*" ".gitignore" "build.sh" "package.json" "package-lock.json" "README.md" "vantage-config.json"
