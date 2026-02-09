import './vue-chatbot.css'
import plugin from './plugin'

export default plugin
export type { VueChatbotOptions, ToolCall, NavigateToolCall } from './types'
export { VueChatbotOptionsKey } from './keys'
export type { AgentToolCall } from './tool-runner'
export { runToolCalls } from './tool-runner'
export type { NavigateToolSchema } from './agent-tools'
export {
  NAVIGATE_TOOL_NAME,
  NAVIGATE_TOOL_SCHEMA,
} from './agent-tools'
