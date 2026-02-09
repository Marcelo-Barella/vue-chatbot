import { defineComponent, h, inject, ref } from 'vue'
import { callAgent, parseToolCalls } from '../agent-api'
import { VueChatbotOptionsKey } from '../keys'
import type { ChatMessage } from '../types'
import { runToolCalls } from '../tool-runner'

export default defineComponent({
  name: 'VueChatbot',
  setup() {
    const options = inject(VueChatbotOptionsKey)
    const messages = ref<ChatMessage[]>([])
    const inputValue = ref('')
    const loading = ref(false)
    const themeStyle = options?.theme
      ? Object.fromEntries(
          Object.entries(options.theme).map(([k, v]) => [
            k.startsWith('--') ? k : `--${k}`,
            v,
          ])
        )
      : undefined

    async function handleSend() {
      if (!options?.router || !options?.apiBaseUrl) return
      const text = inputValue.value.trim()
      if (!text) return
      const userMsg: ChatMessage = { role: 'user', content: text }
      messages.value.push(userMsg)
      inputValue.value = ''
      loading.value = true
      try {
        const apiMessages = messages.value.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
        const res = await callAgent(options.apiBaseUrl, apiMessages)
        const toolCalls = parseToolCalls(res.message)
        if (toolCalls.length > 0) {
          runToolCalls(options.router, toolCalls)
          const toolResults = (res.message?.tool_calls ?? []).map((t) => ({
            role: 'tool' as const,
            content: JSON.stringify({ ok: true }),
            tool_call_id: t.id,
          }))
          const followUpMessages = [
            ...apiMessages,
            {
              role: 'assistant' as const,
              content: res.message?.content ?? '',
              tool_calls: res.message?.tool_calls,
            },
            ...toolResults,
          ]
          const followRes = await callAgent(options.apiBaseUrl, followUpMessages)
          const finalContent = followRes.message?.content ?? ''
          if (finalContent) {
            messages.value.push({ role: 'assistant', content: finalContent })
          }
        } else {
          const content = res.message?.content ?? ''
          if (content) {
            messages.value.push({ role: 'assistant', content })
          }
        }
      } finally {
        loading.value = false
      }
    }

    return () => {
      if (!options) return null
      return h(
        'div',
        { class: 'vue-chatbot', style: themeStyle },
        [
          h(
            'div',
            { class: 'vue-chatbot-messages' },
            messages.value.map((msg, i) =>
              h(
                'div',
                {
                  key: `msg-${i}`,
                  class: ['vue-chatbot-message', `vue-chatbot-message--${msg.role}`],
                },
                [h('span', { class: 'vue-chatbot-message-role' }, msg.role), h('span', { class: 'vue-chatbot-message-content' }, msg.content)]
              )
            )
          ),
          h('div', { class: 'vue-chatbot-input-row' }, [
            h('input', {
              class: 'vue-chatbot-input',
              type: 'text',
              placeholder: 'Message...',
              value: inputValue.value,
              disabled: loading.value,
              onInput: (e: Event) => {
                inputValue.value = (e.target as HTMLInputElement).value
              },
            }),
            h(
              'button',
              {
                class: 'vue-chatbot-send',
                disabled: loading.value || !inputValue.value.trim(),
                onClick: handleSend,
              },
              'Send'
            ),
          ]),
        ]
      )
    }
  },
})
