// src/explorer.js - 区块链浏览器服务器
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const CosmosBlockchain = require('./blockchain');

const app = express();
const PORT = 3000;
const blockchain = new CosmosBlockchain();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// 初始化区块链
blockchain.initialize().then(() => {
  console.log('区块链浏览器服务器启动中...');
});

// API 路由

// 获取区块链状态
app.get('/api/status', (req, res) => {
  res.json(blockchain.getChainStatus());
});

// 获取所有区块
app.get('/api/blocks', (req, res) => {
  const blocks = blockchain.blocks.map(block => ({
    ...block,
    transactionCount: block.transactions.length
  }));
  res.json(blocks.reverse()); // 最新的在前面
});

// 获取特定区块
app.get('/api/block/:height', (req, res) => {
  const height = parseInt(req.params.height);
  const block = blockchain.getBlock(height);
  
  if (!block) {
    return res.status(404).json({ error: '区块不存在' });
  }
  
  res.json(block);
});

// 获取用户信息
app.get('/api/user/:username', (req, res) => {
  const user = blockchain.getUser(req.params.username);
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  res.json(user);
});

// 获取地址余额
app.get('/api/balance/:address', (req, res) => {
  const balance = blockchain.getBalance(req.params.address);
  res.json({ address: req.params.address, balance });
});

// 获取验证者列表
app.get('/api/validators', (req, res) => {
  const validators = Array.from(blockchain.validators.values());
  res.json(validators);
});

// 创建用户
app.post('/api/user', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: '用户名不能为空' });
    }
    
    if (blockchain.wallets.has(username)) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    const user = await blockchain.createUser(username);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 转账
app.post('/api/transfer', async (req, res) => {
  try {
    const { fromUsername, toAddress, amount } = req.body;
    
    if (!fromUsername || !toAddress || !amount) {
      return res.status(400).json({ error: '参数不完整' });
    }
    
    const transaction = await blockchain.transferTokens(fromUsername, toAddress, amount);
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 铸造代币
app.post('/api/mint', async (req, res) => {
  try {
    const { toAddress, amount, reason } = req.body;
    
    if (!toAddress || !amount) {
      return res.status(400).json({ error: '参数不完整' });
    }
    
    const transaction = await blockchain.mintTokens(toAddress, amount, reason);
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加验证者
app.post('/api/validator', async (req, res) => {
  try {
    const { username, stake } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: '用户名不能为空' });
    }
    
    const validator = await blockchain.addValidator(username, stake);
    res.json({ success: true, validator });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 挖矿
app.post('/api/mine', async (req, res) => {
  try {
    const block = await blockchain.mineBlock();
    res.json({ success: true, block });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 自动挖矿（每10秒一个区块）
let autoMining = false;
app.post('/api/auto-mine/start', (req, res) => {
  if (!autoMining) {
    autoMining = true;
    const mineInterval = setInterval(async () => {
      if (!autoMining) {
        clearInterval(mineInterval);
        return;
      }
      try {
        await blockchain.mineBlock();
      } catch (error) {
        console.error('自动挖矿错误:', error);
      }
    }, 10000); // 每10秒挖一个块
  }
  res.json({ success: true, message: '自动挖矿已启动' });
});

app.post('/api/auto-mine/stop', (req, res) => {
  autoMining = false;
  res.json({ success: true, message: '自动挖矿已停止' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🌐 区块链浏览器运行在 http://localhost:${PORT}`);
});

module.exports = app;