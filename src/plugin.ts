import type { App } from 'vue'
import Chatbot from './components/Chatbot'
import { VueChatbotOptionsKey } from './keys'
import type { VueChatbotOptions } from './types'

export type { VueChatbotOptions, NavigateToolCall, ToolCall } from './types'
export { VueChatbotOptionsKey } from './keys'

export function install(app: App, options: VueChatbotOptions): void {
  if (!options?.router || !options?.apiBaseUrl) return
  app.provide(VueChatbotOptionsKey, options)
  app.component('VueChatbot', Chatbot)
}

export default {
  install,
}
