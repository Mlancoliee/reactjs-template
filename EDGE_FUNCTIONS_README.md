# EdgeOne Edge Functions 使用说明

本项目已集成 EdgeOne Edge Functions，提供边缘计算能力。

## 📁 项目结构

```
reactjs-template/
├── edge-functions/          # Edge Functions 目录
│   └── [id].js             # 动态路由处理（处理 /:id 路径）
├── src/                    # React 前端代码
└── package.json
```

## 🎯 架构设计

### EdgeOne Pages 路由机制

**重要概念**：
- **根路径 `/`**: 自动由 React 前端应用处理（`public/index.html` 或 `build/index.html`）
- **动态路径 `/:id`**: 由 `edge-functions/[id].js` 处理（API 接口）
- **EdgeOne Pages 自动代理**: `edgeone pages dev` 会自动处理前端和函数的路由分发

### 工作流程

```
用户请求
  ├─ / (根路径)
  │   └─ EdgeOne Pages → React 应用（自动处理）
  │
  └─ /:id (动态路径, 如 /123)
      └─ EdgeOne Pages → Edge Function [id].js
```

## 🚀 功能说明

### 动态路由处理 (`edge-functions/[id].js`)

**路径**: `/:id` （如 `/123`, `/user`, `/api-test` 等）

**注意**：
- ✅ 此函数只处理动态 ID 路径（`/:id`）
- ❌ 根路径 `/` 由 React 应用自动处理，不经过此函数
- 🔄 EdgeOne Pages 自动识别和分发路由

**路径**: `/:id`

**功能**:
- 处理所有动态 ID 路径，如 `/123`, `/abc`, `/user-profile` 等
- 支持多种 HTTP 方法（GET, POST, PUT, PATCH, DELETE）
- 返回 JSON 格式的响应数据
- 包含请求详情和元数据

**支持的 HTTP 方法**:

#### GET 请求
获取资源信息
```bash
curl http://localhost:8787/123
```

**响应示例**:
```json
{
  "success": true,
  "message": "欢迎访问动态路由",
  "data": {
    "id": "123",
    "method": "GET",
    "path": "/123",
    "timestamp": "2025-10-13T10:30:00.000Z",
    "headers": {
      "userAgent": "Mozilla/5.0...",
      "referer": null
    }
  }
}
```

#### POST 请求
提交数据
```bash
curl -X POST http://localhost:8787/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "email": "zhang@example.com"}'
```

#### PUT/PATCH 请求
更新资源
```bash
curl -X PUT http://localhost:8787/123 \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
```

#### DELETE 请求
删除资源
```bash
curl -X DELETE http://localhost:8787/123
```

---

## 🛠️ 本地开发

### 方式一：只启动 EdgeOne Pages（推荐，适合生产模拟）
```bash
# 先构建 React 应用
npm run build

# 启动 EdgeOne Pages 开发服务器
npm run dev:functions
```

EdgeOne Pages 会：
- 提供 Edge Functions 服务
- 自动服务静态文件（build 目录）
- 模拟生产环境

**访问**: `http://localhost:8088`

---

### 方式二：同时开发前端和函数（推荐，适合开发调试）

**终端 1 - React 开发服务器**（热重载）:
```bash
npm start
```
运行在: `http://localhost:3000`

**终端 2 - EdgeOne Pages**:
```bash
npm run dev:functions
```
运行在: `http://localhost:8088`

**说明**:
- React 服务器提供热重载，方便前端开发
- EdgeOne Pages 服务器提供 Edge Functions
- 两者独立运行，互不干扰

---

## 📝 使用场景示例

### 1. API 接口
```javascript
// 在前端调用 Edge Function API
fetch('/api/user/123')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. 动态内容渲染
访问 `/:id` 路径可以根据不同的 ID 返回不同的内容或数据。

### 3. 中间件功能
可以在 Edge Functions 中实现：
- 身份验证
- 请求日志
- 数据转换
- 缓存控制
- A/B 测试
- 地理位置检测

---

## 🔧 扩展开发

### 如何工作：避免无限循环

当访问根路径 `/` 时，可能出现的问题：
1. 用户请求 `/` 
2. Edge Function 处理请求
3. Edge Function 内部 `fetch('/')` 
4. 又回到 Edge Function... ♾️ **无限循环！**

**解决方案**：使用 `x-edge-skip` 请求头
```javascript
// 第一次请求检查
if (request.headers.get('x-edge-skip')) {
  return fetch(request); // 直接透传，不处理
}

// 添加标记后重新 fetch
const newHeaders = new Headers(request.headers);
newHeaders.set('x-edge-skip', 'true');
const response = await fetch(new Request(request, { headers: newHeaders }));
```

### 创建新的 Edge Function

1. 在 `edge-functions/` 目录下创建新文件：
```bash
# 静态路径
edge-functions/api.js          → 匹配 /api
edge-functions/hello/world.js  → 匹配 /hello/world

# 动态路径
edge-functions/user/[id].js    → 匹配 /user/:id
edge-functions/[category]/[id].js → 匹配 /:category/:id
```

2. 实现 `onRequest` 函数：
```javascript
export async function onRequest(context) {
  const { request, env, params } = context;
  
  return new Response(
    JSON.stringify({ message: 'Hello EdgeOne!' }),
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
}
```

### Context 对象说明

- `request`: Web Platform Request 对象，包含请求信息
- `env`: 环境变量对象，访问配置的环境变量
- `params`: 动态路由参数对象，如 `{ id: '123' }`

---

## 🌍 环境变量

创建 `.env` 文件来管理环境变量：

```bash
# API 密钥示例
API_KEY=your_api_key_here
DATABASE_URL=your_database_url

# EdgeOne 配置
EDGEONE_PROJECT_ID=your_project_id
```

在 Edge Function 中使用：
```javascript
export async function onRequest(context) {
  const apiKey = context.env.API_KEY;
  // 使用环境变量...
}
```

---

## 📦 部署

### 构建前端项目
```bash
npm run build
```

### 部署到 EdgeOne Pages
```bash
edgeone pages deploy
```

部署后，Edge Functions 将自动在全球边缘节点上运行，为用户提供超低延迟的响应。

---

## ⚠️ 注意事项

1. **路径冲突**: 前端页面和 Edge Functions 不能共享相同的路径
2. **运行时限制**: Edge Functions 有 200ms CPU 执行时间限制（不包括等待时间）
3. **代码大小**: 压缩后不超过 5 MB
4. **请求体大小**: 客户端请求体不超过 1 MB
5. **模块支持**: 不支持 Node.js 内置模块，支持大部分 npm 包（beta）

---

## 📚 参考资源

- [EdgeOne Pages 文档](https://pages.edgeone.ai/document/product-introduction)
- [Edge Functions API 参考](https://pages.edgeone.ai/document/edge-functions)
- [最佳实践指南](https://pages.edgeone.ai/document/best-practices)

---

## 🎯 下一步

1. ✅ 已创建基础 Edge Functions
2. 🔄 根据业务需求扩展更多功能
3. 🚀 部署到 EdgeOne Pages 享受全球加速

如有问题，请参考 EdgeOne Pages 官方文档或联系技术支持。

