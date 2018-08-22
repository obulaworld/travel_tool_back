#!/bin/bash

printf "\n\n======================================\n"
printf "Linting"
printf "\n======================================\n\n"
yarn lint

printf "\n\n======================================\n"
printf "Running tests"
printf "\n======================================\n\n"
yarn test
