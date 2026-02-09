import type { Router } from 'vue-router'

export interface AgentToolCall {
  name: string
  arguments?: string | { path?: string }
}

function parseArgs(args: string | { path?: string } | undefined): { path: string } | null {
  if (args == null) return null
  if (typeof args === 'string') {
    try {
      const o = JSON.parse(args) as { path?: string }
      return typeof o?.path === 'string' ? { path: o.path } : null
    } catch {
      return null
    }
  }
  return typeof args.path === 'string' ? { path: args.path } : null
}

export function runToolCalls(
  router: Router,
  toolCalls: AgentToolCall[]
): void {
  for (const call of toolCalls) {
    if (call.name !== 'navigate') continue
    const args = parseArgs(call.arguments)
    if (args) router.push(args.path)
  }
}
