import { NextRequest } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { apiKey?: string; fromEmail?: string }
    const { apiKey, fromEmail } = body

    if (!apiKey || !fromEmail) {
      return new Response(
        JSON.stringify({ message: "缺少 API Key 或发件人邮箱" }),
        { status: 400 }
      )
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: fromEmail,
        subject: "Resend 邮箱验证",
        html: "<p>这是一封验证邮件。如果您收到此邮件，说明配置正确。</p>",
      }),
    })

    const data = await response.json() as any

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          message: data.message || data.error || "测试失败",
          ok: false 
        }),
        { status: response.status }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: "连接成功！验证邮件已发送",
        ok: true,
        data 
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Test Resend connection error:", error)
    return new Response(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "测试失败，请检查输入",
        ok: false 
      }),
      { status: 500 }
    )
  }
}
