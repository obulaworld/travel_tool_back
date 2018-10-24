#!/bin/bash

printf "\n\n======================================\n"
printf "Making database migrations"
printf "\n======================================\n\n"
yarn db:migrate

printf "\n\n======================================\n"
printf "Start the application"
printf "\n======================================\n\n"
yarn start:dev

exit 0
