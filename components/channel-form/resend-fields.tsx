"use client"

import { Input } from "@/components/ui/input"
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

interface ResendFieldsProps {
  form: UseFormReturn<ChannelFormData>
}

export function ResendFields({ form }: ResendFieldsProps) {
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
    </>
  )
}
