import { getOrCreateSessionId } from './session'
import type {
  AgentApiMessage,
  AgentApiResponse,
  AgentApiResponseMessage,
} from './types'
import type { AgentToolCall } from './tool-runner'

function lastUserMessageContent(messages: AgentApiMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') return messages[i].content ?? ''
  }
  return ''
}

export async function callAgent(
  apiBaseUrl: string,
  messages: AgentApiMessage[],
  options?: { headers?: Record<string, string> }
): Promise<AgentApiResponse> {
  const sessionId = getOrCreateSessionId()
  if (sessionId === undefined) throw new Error('sessionId unavailable (e.g. SSR)')
  const message = lastUserMessageContent(messages)
  const headersInit: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers ?? {}),
  }
  const res = await fetch(apiBaseUrl, {
    method: 'POST',
    headers: new Headers(headersInit),
    body: JSON.stringify({ message, sessionId }),
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
