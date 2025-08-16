# Cosmos 区块链演示项目

基于 Cosmos JS SDK + React + TypeScript 开发的现代化区块链演示系统，实现了完整的区块链基础功能。

## 🌟 主要功能

- ✅ **代币生产（铸造）** - 支持系统级代币铸造和分发
- ✅ **用户管理** - 创建新用户和钱包，生成助记词和地址
- ✅ **代币转账** - 用户间的代币转移功能
- ✅ **挖矿系统** - 验证者挖矿、奖励分发、自动挖矿
- ✅ **区块链浏览器** - 现代化Web界面查看区块高度和区块信息

## 🚀 技术栈

### 前端
- **React 18** - 现代化 React 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 美观的图标库
- **Axios** - HTTP 客户端

### 后端
- **Node.js + Express** - 服务器端
- **Cosmos JS SDK** - 区块链核心功能
- **secp256k1** - 椭圆曲线加密

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**：
```bash
git clone https://github.com/hinatayuan/cosmos-blockchain-demo.git
cd cosmos-blockchain-demo
```

2. **安装依赖**：
```bash
npm install
```

3. **清理旧文件（重要！）**：
由于项目结构调整，需要删除 src 目录中的旧后端文件：
```bash
# 删除旧的后端文件
rm src/blockchain.js src/explorer.js src/test.js
```

4. **启动开发环境**：
```bash
# 同时启动后端API服务器和前端开发服务器
npm run start:full

# 或者分别启动
npm run server    # 启动后端 API (端口 3000)
npm run dev       # 启动前端开发服务器 (端口 5173)
```

5. **访问应用**：
- 前端界面: http://localhost:5173
- 后端API: http://localhost:3000

### 生产构建

```bash
npm run build      # 构建前端
npm run start:prod # 构建并启动生产服务器
```

## 🎮 使用方法

### 1. 运行测试
测试所有核心功能：
```bash
npm test
```

### 2. 启动完整应用
启动前后端服务：
```bash
npm run start:full
```

## 📊 Web界面功能

现代化的 React + TypeScript 界面包含5个主要标签页：

- **📦 区块浏览** - 实时查看所有区块信息和哈希
- **👥 用户管理** - 创建用户、查询余额、管理助记词
- **💸 代币转账** - 转账和铸造代币的直观界面
- **⛏️ 挖矿管理** - 手动挖矿和自动挖矿控制面板
- **🛡️ 验证者** - 验证者管理和实时状态监控

### 界面特性

- **响应式设计** - 完美适配桌面和移动设备
- **实时更新** - 自动刷新区块链状态
- **类型安全** - TypeScript 确保代码质量
- **现代化UI** - 玻璃态卡片、渐变背景、动画效果
- **错误处理** - 友好的错误提示和加载状态
- **无障碍设计** - 支持键盘导航和屏幕阅读器

## 🏗️ 项目架构

```
cosmos-blockchain-demo/
├── src/                     # 前端源代码 (React + TypeScript)
│   ├── components/          # React 组件
│   │   ├── tabs/           # 标签页组件
│   │   ├── StatusCard.tsx  # 状态卡片
│   │   ├── TabButton.tsx   # 标签按钮
│   │   ├── Alert.tsx       # 提示组件
│   │   └── ...
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数和 API
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # React 入口
│   └── index.css           # 样式文件
├── server/                  # 后端源代码 (Node.js)
│   ├── blockchain.js       # 区块链核心逻辑
│   ├── explorer.js         # API 服务器
│   └── test.js             # 测试脚本
├── dist/                   # 构建输出目录
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # Tailwind CSS 配置
└── README.md               # 项目文档
```

## 🔧 开发指南

### 添加新功能

1. **定义类型** - 在 `src/types/index.ts` 中添加 TypeScript 类型
2. **创建 API** - 在 `src/utils/api.ts` 中添加 API 方法
3. **开发组件** - 在 `src/components/` 中创建 React 组件
4. **集成功能** - 在对应的标签页中集成新功能

### 样式自定义

使用 Tailwind CSS 自定义样式：
- 修改 `tailwind.config.js` 配置主题
- 在 `src/index.css` 中添加自定义组件样式
- 使用 `glass-card`、`btn-primary` 等预定义类

### API 扩展

在 `server/explorer.js` 中添加新的 API 端点：
```javascript
app.get('/api/new-endpoint', (req, res) => {
  // 实现新功能
});
```

## 📋 API 接口

### 基础信息
- `GET /api/status` - 获取区块链状态
- `GET /api/blocks` - 获取所有区块
- `GET /api/block/:height` - 获取指定区块

### 用户管理
- `POST /api/user` - 创建新用户
- `GET /api/user/:username` - 查询用户信息
- `GET /api/balance/:address` - 查询地址余额

### 交易操作
- `POST /api/transfer` - 代币转账
- `POST /api/mint` - 铸造代币

### 挖矿和验证
- `POST /api/mine` - 挖一个区块
- `POST /api/auto-mine/start` - 开始自动挖矿
- `POST /api/auto-mine/stop` - 停止自动挖矿
- `POST /api/validator` - 添加验证者
- `GET /api/validators` - 获取验证者列表

## 🔒 安全特性

- **助记词生成** - 使用标准BIP39助记词
- **地址生成** - 基于secp256k1曲线
- **交易验证** - 余额检查和签名验证
- **区块哈希** - SHA256哈希算法
- **类型安全** - TypeScript 静态类型检查
- **输入验证** - 前后端双重验证

## 🧪 测试用例

项目包含完整的测试用例：
- 用户创建测试
- 代币铸造测试
- 转账功能测试
- 验证者管理测试
- 挖矿功能测试

## 🛠️ 故障排除

### 常见问题

1. **导入错误**: 如果遇到文件导入错误，请确保删除了 `src` 目录中的旧后端文件
2. **端口冲突**: 确保端口 3000 和 5173 没有被其他程序占用
3. **依赖问题**: 运行 `npm install` 重新安装依赖

### 重置项目

如果遇到问题，可以重置项目：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📈 扩展功能

可以进一步扩展的功能：
- 智能合约支持
- 多重签名钱包
- 跨链资产转移
- 治理投票机制
- 更复杂的共识算法
- WebSocket 实时通信
- 数据可视化图表
- 移动端适配优化

## 🤝 贡献

欢迎提交问题和改进建议！

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请提交 Issue 或 Pull Request。

---

**注意**: 这是一个演示项目，用于学习区块链技术。请勿在生产环境中使用。

## 🎯 学习目标

这个项目适合以下学习场景：
- 区块链技术原理学习
- React + TypeScript 开发实践
- 现代前端工具链使用
- API 设计和前后端交互
- 用户体验设计