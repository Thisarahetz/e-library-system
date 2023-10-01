A e-library system built with Nest.js.

## Project Environment

- Node.js: v16
- npm: 8
- PostgreSQL: 15
- AWS s3
- smtp AWS

## Database Configuration

- Database Name: iese

## Installation

To install the required dependencies, run the following command:

```shell
npm install
```

## Database Seeding

To seed the database with initial data, use the following command:

```shell
npm run seed:run:dev
```

## Running the Application

To start the application in development mode, run the following command:

```shell
npm run start:dev
```

npm run typeorm migration:generate ./src/db/migrations/migrate
npm run typeorm migration:run

@Column({ type: "text", nullable: false, default: '' })
test123: string;
