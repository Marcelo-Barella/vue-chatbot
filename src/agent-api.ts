import type {
  AgentApiMessage,
  AgentApiResponse,
  AgentApiResponseMessage,
} from './types'
import type { AgentToolCall } from './tool-runner'

export async function callAgent(
  apiBaseUrl: string,
  messages: AgentApiMessage[],
  options?: { headers?: Record<string, string> }
): Promise<AgentApiResponse> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers ?? {}),
  }
  const res = await fetch(apiBaseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error(`Agent API error: ${res.status}`)
  return res.json() as Promise<AgentApiResponse>
}

export function parseToolCalls(
  message: AgentApiResponseMessage | undefined
): AgentToolCall[] {
  const raw = message?.tool_calls
  if (!Array.isArray(raw)) return []
  return raw.map((t) => ({
    name: typeof t.name === 'string' ? t.name : '',
    arguments: typeof t.arguments === 'string' ? t.arguments : undefined,
  }))
}
