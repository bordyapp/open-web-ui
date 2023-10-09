[![Bordy - Building open source Trello with steroids.](/assets/bordy%20-%20frame.png)](https://bordy.io)

# Bordy

Building open source Trello with steroids.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Application Setup

### Requirements

- Free [Auth0](https://auth0.com/) account
- Free [Mixpanel](https://mixpanel.com/) account

### Configuration

`./src/main.ts`

- Auth0
```ts
const auth0= createAuth0({
    domain: "{auth0_app_domain}",
    clientId: "{auth0_app_client_id}",
    authorizationParams: {
        audience: 'localhost',
        redirect_uri: window.location.origin
    }
})
```

- Mixpanel
```ts
app.use(VueMixpanel, {
    token: "{mixpanel_token}",
    config: {
        debug: true,
        persistence: 'localStorage'
    }
})
```

- App endpoints

`./src/api/BordyApi.ts`

```ts
const host: string = "http://localhost:8080";
```

`./src/BordieApi.ts`

```ts
const bordyHost = "http://localhost:8080";
```