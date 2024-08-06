# NLW Valoriza
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DiegoVictor/nlw-valoriza/config.yml?logo=github&style=flat-square)](https://github.com/DiegoVictor/nlw-valoriza/actions)
[![sqlite3](https://img.shields.io/badge/sqlite-5.1.7-003b57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![typescript](https://img.shields.io/badge/typescript-5.5.4-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![eslint](https://img.shields.io/badge/eslint-8.57.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/nlw-valoriza?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/nlw-valoriza)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/nlw-valoriza/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=NLW%20Valoriza&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fnlw-valoriza%2Fmain%2FInsomnia_2023-09-06.json)


Allow to register common users and admin users, tags and compliments between users. The app has friendly errors, use JWT to logins, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [SQLite](#sqlite)
      * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [Pagination](#pagination)
    * [Link Header](#link-header)
    * [X-Total-Count](#x-total-count)
  * [Bearer Token](#bearer-token)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use just one database: [SQLite](https://www.sqlite.org/index.html).

### SQLite
Store all application data. For more information to how to setup your database see:
* [typeorm](https://typeorm.io/#/using-ormconfig)
> You can find the application's `ormconfig.js` file in the root folder.

#### Migrations
Remember to run the database migrations:
```
$ yarn ts-node-dev ./node_modules/typeorm/cli.js migration:run
```
Or:
```
$ yarn typeorm migration:run
```
> See more information on [TypeORM Migrations](https://typeorm.io/#/migrations).

### .env
In this file you may configure your database connection, JWT settings, app's port and an url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|PORT|Port number where the app will run.|`3000`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|JWT_EXPIRATION_TIME|How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.|`15m`
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/nlw-valoriza#errors-reference`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Tag already exists",
  "code": 240,
  "docs": "https://github.com/DiegoVictor/nlw-valoriza#errors-reference"
}
```
> Errors are implemented with [@hapi/boom](https://github.com/hapijs/boom).
> As you can see an url to error docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|140|User already exists|An user with the same email already is registered.
|240|Tag already exists|The provided tag name already exists in the database.
|340|Is not allowed create a compliment from and to the same user|You can not create a compliment using the same user `id` in the sender and receiver.
|344|Receiver user not found|The receiver user `id` provided not matches any registry in the database.
|440|Email and/or password is incorret|The provided `email` not match a existing user in the database.
|441|Email and/or password is incorret|Wrong `password`.
|541|You are not authorized|The current user is not admin.
|640|Token not provided|The bearer token was not sent
|641|Token invalid|The provided token is expired or invalid

## Pagination
All the routes with pagination returns 20 records per page, to navigate to other pages just send the `page` query parameter with the number of the page.

* To get the third page of incidents:
```
GET http://localhost:3000/v1/users?page=3
```

### Link Header
Also in the headers of every route with pagination the `Link` header is returned with links to `first`, `last`, `next` and `prev` (previous) page.
```
<http://localhost:3000/v1/tags?page=7>; rel="last",
<http://localhost:3000/v1/tags?page=4>; rel="next",
<http://localhost:3000/v1/tags?page=1>; rel="first",
<http://localhost:3000/v1/tags?page=2>; rel="prev"

```
> See more about this header in this MDN doc: [Link - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link).

### X-Total-Count
Another header returned in routes with pagination, this bring the total records amount.

## Bearer Token
A few routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
GET http://localhost:3000/v1/users?page=1 Authorization: Bearer <token>
```
> To achieve this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid Bearer Token.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3000/v1/tags
```

## Routes
|route|HTTP Method|pagination|params|description|auth method
|:---|:---:|:---:|:---:|:---:|:---:
|`/sessions`|POST|:x:|Body with user `email` and `password`.|Authenticates user and return an access token.|:x:
|`/users`|GET|:heavy_check_mark:|`page` query parameter.|List users.|Bearer
|`/users`|POST|:x:|Body with user `name`, `admin` (flag), `email` and `password`.|Creates a new user.|:x:
|`/tags`|GET|:heavy_check_mark:|`page` query parameter.|List tags.|Bearer
|`/tags`|POST|:x:|Body with tag `name`.|Creates a new tag.|Bearer
|`/compliments/sent`|GET|:heavy_check_mark:|`page` query parameter.|List compliments sent.|Bearer
|`/compliments/received`|GET|:heavy_check_mark:|`page` query parameter.|List compliments received.|Bearer
|`/compliments`|POST|:x:|Body with compliments `message`, `tag_id` and `receiver_id` (user's id).|Creates a new compliments.|Bearer
> Routes with `Bearer` as auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information.

### Requests
* `POST /session`

Request body:
```json
{
  "email": "johndoe@example.com",
  "password": "123456"
}
```

* `POST /users`

Request body:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "123456",
  "admin": true
}
```

* `POST /tags`

Request body:
```json
{
  "name": "Inspiration",
}
```

* `POST /compliment`

Request body:
```json
{
  "tag_id": "a7e96379-e1e0-4b01-954c-38175d3df012",
  "receiver_id": "38015cdf-c70a-420c-9efa-b71b8f7fae1e",
  "message": "Assumenda ducimus quia distinctio eaque"
}
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
