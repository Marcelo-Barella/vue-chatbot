export const NAVIGATE_TOOL_NAME = 'navigate' as const

export interface NavigateToolSchema {
  type: 'function'
  function: {
    name: typeof NAVIGATE_TOOL_NAME
    description: string
    parameters: {
      type: 'object'
      properties: {
        path: { type: 'string'; description: string }
      }
      required: ['path']
      additionalProperties?: false
    }
  }
}

export const NAVIGATE_TOOL_SCHEMA: NavigateToolSchema = {
  type: 'function',
  function: {
    name: NAVIGATE_TOOL_NAME,
    description: 'Navigate the host application to a given path (Vue Router path).',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The route path to navigate to (e.g. "/settings", "/dashboard").',
        },
      },
      required: ['path'],
      additionalProperties: false,
    },
  },
}
