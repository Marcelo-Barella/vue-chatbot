# Agent tool schema (Python / backend)

The chatbot frontend executes a fixed set of tools when the agent returns `tool_calls`. The agent must use these exact **name** and **parameters** so the frontend can run them.

## navigate

Navigates the host application to a given route path using Vue Router.

| Field       | Value        |
| ----------- | ------------ |
| **name**    | `navigate`   |
| **parameters** | `path` (string, required) |

- **path**: The route path to navigate to (e.g. `"/settings"`, `"/dashboard"`). Passed to `router.push(path)` in the host app.

### Example tool call (agent response)

```json
{
  "name": "navigate",
  "arguments": "{\"path\": \"/settings\"}"
}
```

or with an object:

```json
{
  "name": "navigate",
  "arguments": { "path": "/settings" }
}
```

### OpenAI-style tool definition (for agent config)

```json
{
  "type": "function",
  "function": {
    "name": "navigate",
    "description": "Navigate the host application to a given path (Vue Router path).",
    "parameters": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string",
          "description": "The route path to navigate to (e.g. \"/settings\", \"/dashboard\")."
        }
      },
      "required": ["path"],
      "additionalProperties": false
    }
  }
}
```
