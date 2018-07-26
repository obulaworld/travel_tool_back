### travel_tool_back
[![CircleCI](https://circleci.com/gh/andela/travel_tool_back/tree/develop.svg?style=svg)](https://circleci.com/gh/andela/travel_tool_back/tree/develop)

An application for managing travel in Andela.

# Description
__travel_tool_back__ is the backend application for the Andela Travel application which automates travel processes in Andela. This application also helps to collate and manage all travel-related data across Andela's locations.

# Table of Contents
  - [Documentation](#documentation)
  - [Setup](#setup)
    - [Database and ORM](#database-and-orm)
  - [Testing](#testing)
  - [Contribute](#contribute)
  - [Deployment](#deployment)
  - [License](#license)

## Documentation
TODO - when endpoints are ready

## Setup


### Dependencies
- [NodeJS](https://github.com/nodejs/node) - A JavaScript runtime environment
- [Express](https://github.com/expressjs/express) - A web application framework for NodeJS
- [PostgreSQL](https://github.com/postgres/postgres) - A relational database management system that extends SQL
- [Sequelize](https://github.com/sequelize/sequelize) - A promise-based ORM for NodeJS
- [Passport](https://github.com/jaredhanson/passport) - An authentication middleware for NodeJS

### Getting Started
Follow these steps to set up the project in development mode
- Install [Nodejs](https://nodejs.org/en/download/)
- Install and setup [PostgreSQL](https://www.postgresql.org/)
- Clone the repository by running the command
  ```
  git clone https://github.com/andela/travel_tool_back.git
  ```
- Run `cd travel_tool_back` to enter the application's directory
- Install the application's dependencies by running the command
  ```
  yarn install
  ```
- Create a `.env` file in the root of your directory using the `.env.example` file in the repository
- Setup the database and migrations (***see [database setup](#database-and-orm, 'setting up database')***)
- Start the application by running
  ```
  yarn run start:dev
  ```
  The application should now be running at `http://127.0.0.1:5000`

#### Database and ORM
- Create a database in `PostgreSQL` and name it `travel_tool`
- Set the following environment variables:
  - `DB_USER` - this is the database username
  - `DB_PASSWORD` - this is the database password. Ignore if you don't have a database password
- Install `sequelize-cli`
  ```
  yarn add --save sequelize-cli
  ```
- Run database migrations
  ```
  yarn run db:migrate
  ```
- Check the database and confirm that the `users` table has been created

### Run the Service Using Docker
TODO

## Testing
[Jest](https://jestjs.io) is used as the testing framework for both the unit tests and integration tests.
To execute all tests, run the command
```
  yarn test
```

## Contribute
Contributions to the project are welcome! Before contributing, look through the branch naming, commit message and pull request conventions [here](https://github.com/andela/engineering-playbook/tree/master/5.%20Developing/Conventions). When you are all done, follow the guidelines below to raise a pull request:
- Identify the feature, chore or bug to be worked on from the [pivotal tracker board](https://www.pivotaltracker.com/n/projects/2184887). If the ticket does not exist on the board, consult the project owners for approval before adding the ticket to the board.
- Clone the repository and checkout from `develop` to a new branch to start working on the assigned task. Ensure branch names follow the convention linked above.
- Work on the task following the coding standards and [style guide](https://github.com/airbnb/javascript) used in the project.
- When task has been completed, make commits and raise a pull request against `develop` branch, also ensure to follow the conventions linked above.

If the pull request is accepted by the owners of the repository, then it is merged into the `develop` branch and closed.

## Deployment
TODO - add deployment commands

## License
This application is licensed under the terms of the [MIT License](https://github.com/andela/travel_tool_back/blob/develop/LICENSE)
