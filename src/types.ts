import type { Router } from 'vue-router'

export interface VueChatbotOptions {
  router: Router
  apiBaseUrl: string
  theme?: Record<string, string>
}

export interface NavigateToolCall {
  name: 'navigate'
  arguments: { path: string }
}

export type ToolCall = NavigateToolCall

export type ChatMessageRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}

export interface AgentApiMessage {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  tool_call_id?: string
  tool_calls?: AgentToolCallItem[]
}

export interface AgentToolCallItem {
  id: string
  name: string
  arguments: string
}

export interface AgentApiResponseMessage {
  content?: string
  tool_calls?: AgentToolCallItem[]
}

export interface AgentApiResponse {
  message?: AgentApiResponseMessage
}
