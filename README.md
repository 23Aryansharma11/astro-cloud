# Event Page

## .env

The project expects an .env file with the following vars:

```

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

AUTH_SECRET

AUTH_TRUST_HOST

TURSO_DATABASE_URL

TURSO_AUTH_TOKEN

```

## Tools

### Astro

[Astro](https://docs.astro.build/en/getting-started/) is a JavaScript web framework optimized for building fast, content-driven websites. It is often used as a static site generator, but it also has some limited serverside functionality that we will take advantage of here.

### Auth.js (via auth-astro)

[Auth.js](https://authjs.dev/) is a free and open-source authentication adapter. We're using the Astro plugin [auth-astro](https://github.com/nowaythatworked/auth-astro).

## Infrastructure

### Cloudflare

One of the benefits of Astro is that there are adapters that let it run its server-side functionality on edge environments like Cloudflare Pages/Workers. A fringe benefit here is that this is basically free to host. To create a Cloudflare account sign up [here](https://dash.cloudflare.com).

Once you have created an account, initialize the local cli in your project root by runing:

```sh

npx  wrangler  login

```

This will open a Cloudflare login screen in your default browser, authenticate in your browser.

#### Cloudflare Pages - Used for Astro Deployment

##### Setup

- Log in to Cloudflare, and go to: Compute (Workers) -> Workers & Pages.

- Click the blue "Create" button, Select the "Pages" tab.

- Select the "Import an existing Git repository" option.

- Select GitHub and allow the Cloudflare App access to the repo in GitHub.

- Navigate back to Cloudflare, and select the repo

- select "Astro" as the Framework

- add `npm run build` as the build command

- Specify `./dist` as the output directory

#### KV - Used for Astro Session

Cloudflare KV is an arbitrary key-value store. We're using this in Astro to power serverside sessions for remembering if a user is logged-in.

##### Setup

1. Create the KV Store via the Command Line

From the command line in your project, run:

```sh

npx  wrangler  kv  namespace  create  "SESSION"

```

2. Add the namespace to your project.

Follow the propmt to add the kv namespace to your wrangler.jsonc file.

Ensure the namespace is entered in your `/src/env.d.ts` file:

```ts
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {}
}

interface Env {
	SESSION: KVNamespace;
}
```

3. You may need to manually bind the KV store to your Pages project.

- Log in to Cloudflare, and go to: Compute (Workers) -> Workers & Pages. Select your project

- Click the "Settings" tab, and scroll down to "Bindings"

- Click the +Add

- Select the "SESSION" KV store

### Google OAuth2 - Used for Authentication

We're using Google OAuth2 to facilitate Authentication.

#### Setup

Follow Google's [instructions](https://developers.google.com/identity/protocols/oauth2) to create credentials, and configure a consent screen.

You will need to copy the `clientID` and `secret` of the credential you create.

Add these as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env` file and as vars in your Cloudflare Pages project.

You will need to configure Authorized JavaScript origins

- http://localhost:4321 (local dev - vite)

- http://localhost:8787 (local dev - wrangler)

- https://YOUR_PROJECT_NAME.pages.dev (the live url of your production Cloudflare Pages app)

You will need to configure the following Authorized redirect URIs

- http://localhost:4321/api/auth/callback/google (local dev - vite)

- http://localhost:8787/api/auth/callback/google (local dev - wrangler)

- https://YOUR_PROJECT_NAME.pages.dev/api/auth/callback/google (the live url of your production Cloudflare Pages app)

### Turso - Used to Store Some Persistent Data

[Turso](https://turso.tech) is an SQLite hosting service. We're using Turso to store userEvent records (ie events a logged-in user has signed up for).

#### Steup

- Create a turso account, and [sign in](https://app.turso.tech/login).

- Create a Database (Big white "Create Database" button.)

- Find the db url and generate a token. Save these as `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your `.env` file and as vars in your Cloudflare Pages project.

- Go to the "Edit Data" Tab

- Click the "SQL console" button

- Create the db schema. Copy the SQL from `/src/tableConfig.sql`, paste, and "Run All"
