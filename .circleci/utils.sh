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

require PRODUCTION_COMPUTE_ZONE $PRODUCTION_COMPUTE_ZONE
require STAGING_COMPUTE_ZONE $STAGING_COMPUTE_ZONE
require PRODUCTION_INGRESS_STATIC_IP_NAME $PRODUCTION_INGRESS_STATIC_IP_NAME
require STAGING_INGRESS_STATIC_IP_NAME $STAGING_INGRESS_STATIC_IP_NAME
require PRODUCTION_CLUSTER_NAME $PRODUCTION_CLUSTER_NAME
require STAGING_CLUSTER_NAME $STAGING_CLUSTER_NAME
require PRODUCTION_DATABASE_URL $PRODUCTION_DATABASE_URL
require STAGING_DATABASE_URL $STAGING_DATABASE_URL
require STAGING_JWT_PUBLIC_KEY $STAGING_JWT_PUBLIC_KEY
require PRODUCTION_JWT_PUBLIC_KEY $PRODUCTION_JWT_PUBLIC_KEY
require STAGING_DEFAULT_ADMIN $STAGING_DEFAULT_ADMIN
require PRODUCTION_DEFAULT_ADMIN $PRODUCTION_DEFAULT_ADMIN

if [ "$CIRCLE_BRANCH" == 'master' ]; then
    IMAGE_TAG=production-$(git rev-parse --short HEAD)
    export ENVIRONMENT=production
    export COMPUTE_ZONE=$PRODUCTION_COMPUTE_ZONE
    export CLUSTER_NAME=$PRODUCTION_CLUSTER_NAME
    export INGRESS_STATIC_IP_NAME=$PRODUCTION_INGRESS_STATIC_IP_NAME
    export DEFAULT_ADMIN=$PRODUCTION_DEFAULT_ADMIN
    export DATABASE_URL=$PRODUCTION_DATABASE_URL
    export JWT_PUBLIC_KEY=$PRODUCTION_JWT_PUBLIC_KEY
else
    IMAGE_TAG=staging-$(git rev-parse --short HEAD)
    export ENVIRONMENT=staging
    export COMPUTE_ZONE=$STAGING_COMPUTE_ZONE
    export CLUSTER_NAME=$STAGING_CLUSTER_NAME
    export INGRESS_STATIC_IP_NAME=$STAGING_INGRESS_STATIC_IP_NAME
    export DEFAULT_ADMIN=$STAGING_DEFAULT_ADMIN
    export DATABASE_URL=$STAGING_DATABASE_URL
    export JWT_PUBLIC_KEY=$STAGING_JWT_PUBLIC_KEY
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
