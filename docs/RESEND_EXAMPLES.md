// Resend 邮件发送示例

## 示例 1: 简单的 HTML 邮件

**端点配置:**
- 类型: Resend 邮件服务
- API Key: `re_your_api_key`
- 发件人邮箱: `noreply@example.com`

**端点规则:**
```json
{
  "subject": "欢迎使用我们的服务",
  "html": "<h1>欢迎！</h1><p>感谢您的注册。</p>",
  "to": "user@example.com"
}
```

**请求:**
```bash
curl -X POST http://localhost:3000/api/push/endpoint-id \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 示例 2: 使用动态变量的邮件

**端点规则:**
```json
{
  "subject": "订单确认 - {{ order_id }}",
  "html": "<h1>订单确认</h1><p>订单号: {{ order_id }}</p><p>金额: ¥{{ amount }}</p>",
  "to": "{{ customer_email }}",
  "reply_to": "support@example.com"
}
```

**请求:**
```bash
curl -X POST http://localhost:3000/api/push/endpoint-id \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-2025-001",
    "amount": 999.99,
    "customer_email": "customer@example.com"
  }'
```

---

## 示例 3: 纯文本邮件

**端点规则:**
```json
{
  "subject": "验证码",
  "text": "您的验证码是: {{ code }}\n请在 10 分钟内使用此码。"
}
```

**请求:**
```bash
curl -X POST http://localhost:3000/api/push/endpoint-id \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

---

## 示例 4: 复杂的 HTML 邮件模板

**端点规则:**
```json
{
  "subject": "{{ subject }}",
  "html": "<html><body><style>body { font-family: Arial, sans-serif; }</style><h1>{{ title }}</h1><p>亲爱的 {{ user_name }},</p><p>{{ content }}</p><hr/><footer><p>此邮件由 MoePush 发送</p></footer></body></html>",
  "to": "{{ email }}",
  "reply_to": "support@example.com"
}
```

**请求:**
```bash
curl -X POST http://localhost:3000/api/push/endpoint-id \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "重要通知",
    "title": "系统维护通知",
    "user_name": "张三",
    "content": "我们将在明天进行系统维护，预计持续 2 小时。",
    "email": "zhangsan@example.com"
  }'
```

---

## Node.js/JavaScript 中发送请求

```javascript
const axios = require('axios');

async function sendNotification() {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/push/your-endpoint-id',
      {
        order_id: "ORD-2025-001",
        amount: 999.99,
        customer_email: "customer@example.com"
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('邮件发送成功:', response.data);
  } catch (error) {
    console.error('邮件发送失败:', error.message);
  }
}

sendNotification();
```

---

## Python 中发送请求

```python
import requests
import json

url = 'http://localhost:3000/api/push/your-endpoint-id'
payload = {
    'order_id': 'ORD-2025-001',
    'amount': 999.99,
    'customer_email': 'customer@example.com'
}

try:
    response = requests.post(url, json=payload)
    response.raise_for_status()
    print('邮件发送成功:', response.json())
except requests.exceptions.RequestException as e:
    print('邮件发送失败:', str(e))
```

---

## 注意事项

1. **模板变量**: 使用 `{{ variable_name }}` 语法在规则中引用请求中的字段
2. **邮件验证**: 确保发件人邮箱已在 Resend 中验证
3. **收件人邮箱**: 可以在规则中硬编码，或从请求参数动态指定
4. **HTML 内容**: 确保 HTML 格式正确，避免被邮件客户端标记为垃圾邮件
5. **发送限制**: Resend 免费计划每天限制 100 封邮件
