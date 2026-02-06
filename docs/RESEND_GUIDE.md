# Resend 邮件发送集成指南

本指南说明如何在 MoePush 中使用 Resend 邮件服务发送电子邮件。

## 功能概述

Resend 是一个现代化的邮件发送服务，提供简单的 API 接口。通过 MoePush 的 Resend 集成，您可以：

- 发送 HTML 格式的邮件
- 发送纯文本邮件  
- 设置邮件主题和回复地址
- 支持动态收件人（通过请求参数指定）

## 快速开始

### 1. 获取 Resend API Key

1. 访问 [Resend 官网](https://resend.com)
2. 注册或登录您的账户
3. 进入 [API Keys 页面](https://resend.com/api-keys)
4. 创建新的 API Key
5. 复制您的 API Key（格式为 `re_xxxxxxxxxxxxx`）

### 2. 验证发件人邮箱

在 Resend 平台中：
1. 进入 Domains 或 Verified Emails 设置
2. 验证您要使用的发件人邮箱地址
3. 按照平台提示完成验证

### 3. 在 MoePush 中添加 Resend 渠道

1. 在 MoePush 应用中创建新渠道
2. 选择 "Resend 邮件服务" 类型
3. 填入以下信息：
   - **API Key**: 您从 Resend 获取的 API Key
   - **发件人邮箱**: 已验证的发件人邮箱地址
4. 点击"测试连接"验证配置（会向您的邮箱发送测试邮件）
5. 保存渠道配置

## 发送邮件

### HTML 邮件模板

在创建端点时选择 "HTML 邮件" 模板，填入规则如下：

```json
{
  "subject": "邮件主题",
  "html": "<h1>您好</h1><p>这是一封 HTML 邮件</p>",
  "to": "recipient@example.com"
}
```

**字段说明：**
- `subject` (必需): 邮件主题
- `html` (必需): HTML 格式的邮件内容
- `to` (可选): 收件人邮箱。如果不指定，将使用配置中的发件人邮箱
- `reply_to` (可选): 回复地址

### 纯文本邮件模板

在创建端点时选择 "纯文本邮件" 模板，填入规则如下：

```json
{
  "subject": "邮件主题",
  "text": "这是一封纯文本邮件内容",
  "to": "recipient@example.com"
}
```

**字段说明：**
- `subject` (必需): 邮件主题
- `text` (必需): 纯文本邮件内容
- `to` (可选): 收件人邮箱。如果不指定，将使用配置中的发件人邮箱
- `reply_to` (可选): 回复地址

## 动态内容示例

### 使用请求参数动态生成邮件

假设您的 POST 请求包含以下 JSON 数据：

```json
{
  "user_name": "张三",
  "order_id": "ORD-12345",
  "order_amount": 999.99
}
```

您可以创建如下规则模板：

```json
{
  "subject": "订单确认 - {{ user_name }}",
  "html": "<h1>订单确认</h1><p>尊敬的 {{ user_name }}，</p><p>您的订单 {{ order_id }} 已确认。订单金额：￥{{ order_amount }}</p>",
  "to": "customer@example.com"
}
```

## 高级用法

### 带有模板变量的邮件

支持在规则中使用 `{{ }}` 语法替换来自请求的数据：

```json
{
  "subject": "通知: {{ notification_type }}",
  "html": "<p>{{ message_content }}</p>",
  "to": "{{ recipient_email }}"
}
```

### HTML 邮件示例

```json
{
  "subject": "欢迎注册 MoePush",
  "html": "<html><body><h1>欢迎使用 MoePush!</h1><p>感谢您的注册。</p><a href='https://example.com/verify'>点击验证邮箱</a></body></html>",
  "reply_to": "support@example.com"
}
```

## 故障排除

### 测试连接失败

**问题**: 点击"测试连接"时出错

**解决方案**:
1. 检查 API Key 是否正确（应以 `re_` 开头）
2. 验证发件人邮箱是否已在 Resend 中验证
3. 确保 API Key 有发送邮件的权限
4. 检查网络连接是否正常

### 实际发送邮件失败

**问题**: 邮件无法发送

**解决方案**:
1. 检查收件人邮箱格式是否正确
2. 确保邮件主题 (`subject`) 和内容 (`html` 或 `text`) 不为空
3. 检查模板变量是否正确替换
4. 查看 MoePush 的错误日志获取详细信息

### 邮件进入垃圾箱

**问题**: 邮件被标记为垃圾邮件

**解决方案**:
1. 验证发件人域名（在 Resend 中设置 SPF、DKIM 记录）
2. 使用清晰的邮件主题
3. 避免常见的垃圾邮件关键词
4. 确保有明确的"取消订阅"链接（用于营销邮件）

## API 限制

Resend 免费计划限制：
- 每天最多 100 封邮件
- 支持自定义域名需要升级计划

详见 [Resend 定价页面](https://resend.com/pricing)

## 更多资源

- [Resend 官方文档](https://resend.com/docs)
- [Resend API 参考](https://resend.com/docs/api-reference/emails/send)
- [MoePush 主文档](../README.md)

## 常见问题

**Q: 可以一次发送多个收件人吗?**
A: 当前实现每次发送到一个收件人。如需群发，可以在上层应用中循环调用 API。

**Q: 支持发送附件吗?**
A: 当前版本不支持附件，可以在后续版本中添加。

**Q: 如何处理邮件发送失败?**
A: MoePush 会返回错误信息。检查错误日志并根据 Resend API 文档解决问题。
