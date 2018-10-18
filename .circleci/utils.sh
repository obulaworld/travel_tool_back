#!/usr/bin/env bash
set -e

BOLD='\e[1m'
BLUE='\e[34m'
RED='\e[31m'
YELLOW='\e[33m'
GREEN='\e[92m'
NC='\e[0m'


info() {
    printf "\n${BOLD}${BLUE}====> $(echo $@ ) ${NC}\n"
}

warning () {
    printf "\n${BOLD}${YELLOW}====> $(echo $@ )  ${NC}\n"
}

error() {
    printf "\n${BOLD}${RED}====> $(echo $@ )  ${NC}\n"; exit 1
}

success () {
    printf "\n${BOLD}${GREEN}====> $(echo $@ ) ${NC}\n"
}

is_success_or_fail() {
    if [ "$?" == "0" ]; then success $@; else error $@; fi
}

is_success() {
    if [ "$?" == "0" ]; then success $@; fi
}

# require "variable name" "value"
require () {
    if [ -z ${2+x} ]; then error "Required variable ${1} has not been set"; fi
}

SERVICE_KEY_PATH=$HOME/service-account-key.json

# assert required variables
# Production variables needed for deployment
require PRODUCTION_COMPUTE_ZONE $PRODUCTION_COMPUTE_ZONE
require PRODUCTION_STATIC_IP $PRODUCTION_STATIC_IP
require PRODUCTION_CLUSTER_NAME $PRODUCTION_CLUSTER_NAME

# Staging variables needed for deployment
require STAGING_COMPUTE_ZONE $STAGING_COMPUTE_ZONE
require STAGING_STATIC_IP $STAGING_STATIC_IP
require STAGING_CLUSTER_NAME $STAGING_CLUSTER_NAME

# Production variables needed in application
require PRODUCTION_DATABASE_URL $PRODUCTION_DATABASE_URL
require PRODUCTION_JWT_PUBLIC_KEY $PRODUCTION_JWT_PUBLIC_KEY
require PRODUCTION_DEFAULT_ADMIN $PRODUCTION_DEFAULT_ADMIN
require PRODUCTION_BUGSNAG_API_KEY $PRODUCTION_BUGSNAG_API_KEY
require PRODUCTION_REDIRECT_URL $PRODUCTION_REDIRECT_URL
require PRODUCTION_MAILGUN_API_KEY $PRODUCTION_MAILGUN_API_KEY
require PRODUCTION_MAILGUN_DOMAIN_NAME $PRODUCTION_MAILGUN_DOMAIN_NAME
require PRODUCTION_MAIL_SENDER $PRODUCTION_MAIL_SENDER

# Staging variables needed in application
require STAGING_DATABASE_URL $STAGING_DATABASE_URL
require STAGING_JWT_PUBLIC_KEY $STAGING_JWT_PUBLIC_KEY
require STAGING_DEFAULT_ADMIN $STAGING_DEFAULT_ADMIN
require STAGING_BUGSNAG_API_KEY $STAGING_BUGSNAG_API_KEY
require STAGING_REDIRECT_URL $STAGING_REDIRECT_URL
require STAGING_MAILGUN_API_KEY $STAGING_MAILGUN_API_KEY
require STAGING_MAILGUN_DOMAIN_NAME $STAGING_MAILGUN_DOMAIN_NAME
require STAGING_MAIL_SENDER $STAGING_MAIL_SENDER

if [ "$CIRCLE_BRANCH" == 'master' ]; then
    IMAGE_TAG=production-$(git rev-parse --short HEAD)
    export ENVIRONMENT=production
    export COMPUTE_ZONE=$PRODUCTION_COMPUTE_ZONE
    export CLUSTER_NAME=$PRODUCTION_CLUSTER_NAME
    export STATIC_IP=$PRODUCTION_STATIC_IP

    export DEFAULT_ADMIN=$PRODUCTION_DEFAULT_ADMIN
    export DATABASE_URL=$PRODUCTION_DATABASE_URL
    export JWT_PUBLIC_KEY=$PRODUCTION_JWT_PUBLIC_KEY
    export BUGSNAG_API_KEY=$PRODUCTION_BUGSNAG_API_KEY
    export REDIRECT_URL=$PRODUCTION_REDIRECT_URL
    export MAILGUN_API_KEY=$PRODUCTION_MAILGUN_API_KEY
    export MAILGUN_DOMAIN_NAME=$PRODUCTION_MAILGUN_DOMAIN_NAME
    export MAIL_SENDER=$PRODUCTION_MAIL_SENDER
else
    IMAGE_TAG=staging-$(git rev-parse --short HEAD)
    export ENVIRONMENT=staging
    export COMPUTE_ZONE=$STAGING_COMPUTE_ZONE
    export CLUSTER_NAME=$STAGING_CLUSTER_NAME
    export STATIC_IP=$STAGING_STATIC_IP

    export DEFAULT_ADMIN=$STAGING_DEFAULT_ADMIN
    export DATABASE_URL=$STAGING_DATABASE_URL
    export JWT_PUBLIC_KEY=$STAGING_JWT_PUBLIC_KEY
    export BUGSNAG_API_KEY=$STAGING_BUGSNAG_API_KEY
    export REDIRECT_URL=$STAGING_REDIRECT_URL
    export MAILGUN_API_KEY=$STAGING_MAILGUN_API_KEY
    export MAILGUN_DOMAIN_NAME=$STAGING_MAILGUN_DOMAIN_NAME
    export MAIL_SENDER=$STAGING_MAIL_SENDER
fi

export NAMESPACE=$ENVIRONMENT

EMOJIS=(
    ":celebrate:"  ":party_dinosaur:"  ":andela:" ":aw-yeah:" ":carlton-dance:"
    ":partyparrot:" ":dancing-penguin:" ":aww-yeah-remix:"
)

RANDOM=$$$(date +%s)

EMOJI=${EMOJIS[$RANDOM % ${#EMOJIS[@]} ]}

LINK="https://github.com/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/commit/${CIRCLE_SHA1}"

SLACK_TEXT="Git Commit Tag: <$LINK|${IMAGE_TAG}> has just been deployed to *${PROJECT_NAME}* in *${ENVIRONMENT}* ${EMOJI}"
