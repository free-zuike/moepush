"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import type { ChannelFormData } from "@/lib/db/schema/channels"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface ResendFieldsProps {
  form: UseFormReturn<ChannelFormData>
}

export function ResendFields({ form }: ResendFieldsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function testConnection() {
    const apiKey = form.getValues("secret")
    const fromEmail = form.getValues("webhook")
    
    if (!apiKey) {
      toast({
        title: "错误",
        description: "请先输入 API Key",
        variant: "destructive",
      })
      return
    }

    if (!fromEmail) {
      toast({
        title: "错误",
        description: "请先输入发件人邮箱",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
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

      if (!response.ok) {
        const data = await response.json() as { message?: string; error?: string }
        throw new Error(data.message || data.error || "测试失败")
      }

      toast({
        title: "成功",
        description: "连接成功！验证邮件已发送到您的邮箱",
      })
    } catch (error) {
      toast({
        title: "连接失败",
        description: error instanceof Error ? error.message : "请检查 API Key 和邮箱",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <FormField
        control={form.control}
        name="secret"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              API Key
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="re_your_api_key" 
                className="font-mono"
                type="password"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              从 <a 
                href="https://resend.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Resend 控制台
              </a> 获取您的 API Key
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="webhook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              发件人邮箱
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="noreply@example.com" 
                type="email"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              用于发送邮件的邮箱地址，需要在 Resend 中验证
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <Button 
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={testConnection}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          测试连接
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          点击测试连接会向您的邮箱发送一封验证邮件
        </p>
      </div>
    </>
  )
}
