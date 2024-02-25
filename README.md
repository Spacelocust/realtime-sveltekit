# Real-time SvelteKit

Real-time project for ESGI with SvelteKit.

## Content

- [Real-time SvelteKit](#real-time-sveltekit)
  - [Content](#content)
  - [Launch the project](#launch-the-project)
  - [Accounts](#accounts)
  - [Libraries](#libraries)
  - [Services](#services)
  - [Makefile commands](#makefile-commands)
  - [E2E tests](#e2e-tests)

## Launch the project

Launch the project using the `make start` and then `make db-migrate` commands.
Additionally, you can use the `make db-fixtures` command to add some fixtures to the database.
You can then stop and relaunch the project using the `make stop` and `make up` commands.

You can view the project on [http://localhost:5173](http://localhost:5173).
The database UI is available on [http://localhost:8080](http://localhost:8080).

## Accounts

Users available after running the `make db-fixtures` command.

| Username   | Password | Role    |
| ---------- | -------- | ------- |
| `dallas`   | `xxx`    | `admin` |
| `bob`      | `xxx`    | `admin` |
| `shade`    | `xxx`    | `admin` |
| `karl`     | `xxx`    | `user`  |
| `caddyman` | `xxx`    | `user`  |

## Libraries

Librairies, frameworks and tools used in this project.

- [SvelteKit](https://kit.svelte.dev)
- [TailwindCSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [DrizzleORM](https://orm.drizzle.team)
- [Superforms](https://superforms.rocks)
- [Docker](https://www.docker.com)
- [Playwright](https://playwright.dev)
- [shadcn-svelte](https://www.shadcn-svelte.com)
- [Bun](https://bun.sh)
- [Vite](https://vitejs.dev)
- [PostCSS](https://postcss.org)

## Services

Services used by the `compose.yml` file.

- `svelte-kit` : The SvelteKit service. Container name : `cc-app`.
- `mysql` : The MySQL service. Container name : `cc-mysql`.
- `phpmyadmin` : The PHPMyAdmin service. Container name : `cc-phpmyadmin`.

## Makefile commands

Many commands are available in the Makefile. Here are a few of them.

| Command              | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `make start`         | Start the project, all the containers and run additional commands.    |
| `make start-nocache` | Start the project and all the containers without using the cache.     |
| `make up`            | Start the project and all the containers.                             |
| `make up-recreate`   | Start the project and all the containers and recreate the containers. |
| `make stop`          | Stop the project and all the containers.                              |
| `make restart`       | Restart the project and all the containers.                           |
| `make down`          | Stop and remove the project and all the containers.                   |
| `make ssh`           | SH into the project container.                                        |
| `make build-app`     | Build the app.                                                        |
| `make preview-app`   | Preview the app.                                                      |
| `make lint`          | Lint the app using ESLint + Prettier.                                 |
| `make format`        | Format the app using ESLint + Prettier.                               |
| `make update`        | Update the dependencies with Bun.                                     |
| `make logs`          | Show the logs of the different containers.                            |

To list all the available commands, run the `make` command.

## E2E tests

You need to have [Bun](https://bun.sh) installed. You need to also make sure the project is up and running.

Launch `make test-install` once to install Playwright. Then, you can use the `make test` command to run the tests.
A `make test-ui` command is also available to run the tests in the Playwright UI.
