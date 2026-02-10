# vue-chatbot

Vue 3 chatbot UI that integrates with an AI agent and runs agent tools (e.g. navigate) in the host app.

## Install

```bash
npm install vue-chatbot
```

Peer dependencies: `vue` ^3.x, `vue-router` ^4.x.

## Usage

```js
import { createApp } from 'vue'
import App from './App.vue'
import VueChatbot from 'vue-chatbot'
import 'vue-chatbot/vue-chatbot.css'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.use(VueChatbot, {
  router,
  apiBaseUrl: 'https://your-agent-api.example.com',
  headers: {
    Authorization: 'Bearer YOUR_TOKEN',
  },
})
app.mount('#app')
```

In a template:

```html
<VueChatbot />
```

## Nuxt

1. Install the package and ensure `vue` and `vue-router` are present (Nuxt provides them).

2. Add a client-side plugin, e.g. `plugins/vue-chatbot.client.ts`:

```ts
import VueChatbot from 'vue-chatbot'
import 'vue-chatbot/vue-chatbot.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueChatbot, {
    router: nuxtApp.$router,
    apiBaseUrl:
      process.env.NUXT_PUBLIC_AGENT_API_URL ||
      'https://your-agent-api.example.com',
    headers: {
      Authorization: `Bearer ${
        process.env.NUXT_PUBLIC_AGENT_API_TOKEN || 'YOUR_TOKEN'
      }`,
    },
  })
})
```

3. Use the component in a page or layout:

```html
<template>
  <VueChatbot />
</template>
```

Set `NUXT_PUBLIC_AGENT_API_URL` in `.env` or pass `apiBaseUrl` directly. Omit or fill `theme` as needed.

## Styling and CSS variables

The package ships default styles via the `vue-chatbot.css` entry. Import it once (see Usage). All visual tokens are defined as CSS custom properties on the `.vue-chatbot` root so the host can override them without editing the package.

### How to override

1. Import the package CSS first, then in your own stylesheet (or a scope that wraps where you render the chatbot) set the variables on the chatbot root or an ancestor:

```css
.vue-chatbot {
  --vue-chatbot-bg: #1e1e1e;
  --vue-chatbot-send-bg: #0d7377;
}
```

2. Or pass a `theme` object when installing the plugin; keys are CSS variable names (with or without `--`). These are applied as inline styles on the chatbot root and override the stylesheet defaults:

```js
app.use(VueChatbot, {
  router,
  apiBaseUrl: 'https://your-agent-api.example.com',
  theme: {
    '--vue-chatbot-bg': '#1e1e1e',
    '--vue-chatbot-send-bg': '#0d7377',
  },
})
```

### Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vue-chatbot-bg` | `#f5f5f5` | Chatbot container background |
| `--vue-chatbot-border` | `#e0e0e0` | Container border color |
| `--vue-chatbot-radius` | `8px` | Border radius for container and inner elements |
| `--vue-chatbot-font-family` | `system-ui, sans-serif` | Base font family |
| `--vue-chatbot-font-size` | `14px` | Base font size |
| `--vue-chatbot-message-user-bg` | `#e3f2fd` | User message background |
| `--vue-chatbot-message-user-color` | `#0d47a1` | User message text color |
| `--vue-chatbot-message-assistant-bg` | `#fff` | Assistant message background |
| `--vue-chatbot-message-assistant-color` | `#212121` | Assistant message text color |
| `--vue-chatbot-message-role-color` | `#757575` | Message role label color |
| `--vue-chatbot-input-bg` | `#fff` | Input field background |
| `--vue-chatbot-input-border` | `#e0e0e0` | Input border color |
| `--vue-chatbot-input-color` | `#212121` | Input text color |
| `--vue-chatbot-send-bg` | `#1976d2` | Send button background |
| `--vue-chatbot-send-color` | `#fff` | Send button text color |
| `--vue-chatbot-send-disabled-bg` | `#bdbdbd` | Send button background when disabled |
| `--vue-chatbot-send-disabled-color` | `#757575` | Send button text color when disabled |

## Agent tools

The agent may return `tool_calls`; the frontend runs a fixed set of tools using the injected `router`. Supported tool:

- **navigate**: `path` (string, required). Runs `router.push(path)` in the host app.

Full schema and OpenAI-style tool definition for the Python/backend agent: [docs/agent-tools.md](docs/agent-tools.md).

## Publishing

The package is configured for public npm via `publishConfig.access: "public"` in `package.json`. Build with `npm run build` before publishing; `files` and `exports` in `package.json` define what is included.
