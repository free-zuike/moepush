import { BaseChannel, ChannelConfig, SendMessageOptions } from "./base"

interface ResendMessage {
  subject: string
  to?: string
  html?: string
  text?: string
  reply_to?: string
  headers?: Record<string, string>
}

export class ResendChannel extends BaseChannel {
  readonly config: ChannelConfig = {
    type: "resend",
    label: "Resend 邮件服务",
    templates: [
      {
        type: "html",
        name: "HTML 邮件",
        description: "支持 HTML 格式的邮件",
        fields: [
          { key: "subject", description: "邮件主题", required: true, component: 'input' },
          { key: "html", description: "邮件 HTML 内容", required: true, component: 'textarea' },
          { key: "to", description: "收件人邮箱，如果不填则使用配置中的默认邮箱", component: 'input', placeholder: "user@example.com" },
          { key: "reply_to", description: "回复地址（可选）", component: 'input', placeholder: "reply@example.com" },
        ],
      },
      {
        type: "text",
        name: "纯文本邮件",
        description: "发送纯文本邮件",
        fields: [
          { key: "subject", description: "邮件主题", required: true, component: 'input' },
          { key: "text", description: "邮件文本内容", required: true, component: 'textarea' },
          { key: "to", description: "收件人邮箱，如果不填则使用配置中的默认邮箱", component: 'input', placeholder: "user@example.com" },
          { key: "reply_to", description: "回复地址（可选）", component: 'input', placeholder: "reply@example.com" },
        ],
      },
    ]
  }

  async sendMessage(
    message: ResendMessage,
    options: SendMessageOptions
  ): Promise<Response> {
    const { secret, webhook } = options
    
    if (!secret) {
      throw new Error("缺少 Resend API Key")
    }
    
    if (!webhook) {
      throw new Error("缺少发件人邮箱地址")
    }

    // 如果消息中没有指定收件人，使用发件人邮箱作为收件人（用于测试）
    const to = message.to || webhook
    
    console.log('ResendMessage:', { ...message, to })

    const payload = {
      from: webhook,
      to,
      subject: message.subject,
      ...(message.html && { html: message.html }),
      ...(message.text && { text: message.text }),
      ...(message.reply_to && { reply_to: message.reply_to }),
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const data = await response.json() as { message?: string; error?: string }
      throw new Error(`Resend 邮件发送失败: ${data.message || data.error || "未知错误"}`)
    }

    return response
  }
} 
