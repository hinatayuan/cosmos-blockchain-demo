# Cosmos 区块链演示项目

基于 Cosmos JS SDK 开发的区块链演示系统，实现了完整的区块链基础功能。

## 🌟 主要功能

- ✅ **代币生产（铸造）** - 支持系统级代币铸造和分发
- ✅ **用户管理** - 创建新用户和钱包地址
- ✅ **代币转账** - 用户间的代币转移功能
- ✅ **挖矿系统** - 验证者挖矿和奖励分发机制
- ✅ **区块链浏览器** - Web界面查看区块高度和区块信息

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/hinatayuan/cosmos-blockchain-demo.git
cd cosmos-blockchain-demo
```

2. **安装依赖**
```bash
npm install
```

3. **启动区块链浏览器**
```bash
npm run explorer
```
然后访问 http://localhost:3000

## 🎮 使用方法

### 1. 运行测试
测试所有核心功能：
```bash
npm test
```

### 2. 启动区块链浏览器
启动Web界面：
```bash
npm run explorer
```

### 3. 核心功能演示

#### 创建用户
```javascript
const blockchain = new CosmosBlockchain();
await blockchain.initialize();

// 创建新用户
const user = await blockchain.createUser('alice');
console.log('用户地址:', user.address);
```

#### 代币铸造
```javascript
// 铸造代币到指定地址
await blockchain.mintTokens(user.address, 1000, '初始资金');
```

#### 代币转账
```javascript
// 用户间转账
await blockchain.transferTokens('alice', bobAddress, 100);
```

#### 添加验证者
```javascript
// 将用户设置为验证者
await blockchain.addValidator('alice', 1000);
```

#### 挖矿
```javascript
// 挖一个新区块
const block = await blockchain.mineBlock();
console.log('新区块高度:', block.height);
```

## 📊 Web界面功能

访问 http://localhost:3000 可以使用以下功能：

- **📦 区块浏览** - 查看所有区块信息
- **👥 用户管理** - 创建和查询用户
- **💸 代币转账** - 转账和铸造代币
- **⛏️ 挖矿管理** - 手动挖矿和自动挖矿
- **🛡️ 验证者** - 管理网络验证者

## 🏗️ 项目架构

```
cosmos-blockchain-demo/
├── src/
│   ├── blockchain.js      # 区块链核心逻辑
│   ├── explorer.js        # Web API 服务器
│   └── test.js           # 测试脚本
├── public/
│   └── index.html        # Web界面
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## 🔧 技术栈

- **后端**: Node.js + Express
- **区块链**: Cosmos JS SDK
- **前端**: HTML5 + CSS3 + JavaScript
- **加密**: secp256k1 椭圆曲线加密

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

## 🧪 测试用例

项目包含完整的测试用例：
- 用户创建测试
- 代币铸造测试
- 转账功能测试
- 验证者管理测试
- 挖矿功能测试

## 📈 扩展功能

可以进一步扩展的功能：
- 智能合约支持
- 多重签名钱包
- 跨链资产转移
- 治理投票机制
- 更复杂的共识算法

## 🤝 贡献

欢迎提交问题和改进建议！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请提交 Issue 或 Pull Request。

---

**注意**: 这是一个演示项目，用于学习区块链技术。请勿在生产环境中使用。