#!/usr/bin/env bash

cd public
npm run build

cd -
node main.js
