# AI Title Manager

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

### Redis
Redis is used to store credentials over time.

1. Using [docker](https://www.docker.com/), run `docker-compose up -d` to bring up the redis container.

### ENV Variables

1. Clone .env.copy
2. Create your application on [twitch developers](https://dev.twitch.tv/console/apps/create).
3. Get your client ID and secret from this application.
4. Set AUTH and OAUTH redirect to use http://localhost:5173 or use something like [ngrok](https://ngrok.com/) to redirect Internet traffic locally.
5. Use `getUser` with your username to get the broadcaster id of your personal twitch and set it as `VITE_BROADCASTER_ID`.

Continue to run the app.

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.