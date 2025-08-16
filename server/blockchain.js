// server/blockchain.js - 区块链核心实现
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const crypto = require('crypto');
const bip39 = require('bip39');

class CosmosBlockchain {
  constructor() {
    this.chain_id = 'mychain-1';
    this.rpc_endpoint = 'http://localhost:26657';
    this.wallets = new Map(); // 存储钱包
    this.blocks = []; // 本地区块存储
    this.currentHeight = 0;
    this.validators = new Map(); // 验证者/矿工
    this.totalSupply = 1000000; // 初始代币总供应量
    this.balances = new Map(); // 账户余额
    this.faucetAddress = null; // 水龙头地址
  }

  // 1. 创建新用户/钱包
  async createUser(username) {
    try {
      // 生成标准BIP39助记词
      const mnemonic = bip39.generateMnemonic();
      
      // 创建钱包
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        {
          prefix: 'cosmos',
        }
      );

      // 获取地址
      const [firstAccount] = await wallet.getAccounts();
      const address = firstAccount.address;

      // 存储用户信息
      const user = {
        username,
        address,
        mnemonic,
        wallet,
        balance: 0,
        created: new Date().toISOString()
      };

      this.wallets.set(username, user);
      this.balances.set(address, 0);

      console.log(`✅ 用户创建成功:`);
      console.log(`用户名: ${username}`);
      console.log(`地址: ${address}`);
      console.log(`助记词: ${mnemonic}`);
      
      return user;
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  // 2. 代币生产（铸造）
  async mintTokens(toAddress, amount, reason = '挖矿奖励') {
    try {
      const currentBalance = this.balances.get(toAddress) || 0;
      const newBalance = currentBalance + amount;
      
      this.balances.set(toAddress, newBalance);
      this.totalSupply += amount;

      // 创建铸币交易记录
      const transaction = {
        type: 'mint',
        from: 'system',
        to: toAddress,
        amount,
        reason,
        timestamp: new Date().toISOString(),
        txHash: this.generateTxHash()
      };

      console.log(`🪙 代币铸造成功:`);
      console.log(`地址: ${toAddress}`);
      console.log(`数量: ${amount}`);
      console.log(`原因: ${reason}`);
      console.log(`新余额: ${newBalance}`);

      return transaction;
    } catch (error) {
      console.error('代币铸造失败:', error);
      throw error;
    }
  }

  // 3. 代币转账
  async transferTokens(fromUsername, toAddress, amount) {
    try {
      const fromUser = this.wallets.get(fromUsername);
      if (!fromUser) {
        throw new Error('发送者用户不存在');
      }

      const fromBalance = this.balances.get(fromUser.address) || 0;
      if (fromBalance < amount) {
        throw new Error('余额不足');
      }

      // 扣除发送者余额
      this.balances.set(fromUser.address, fromBalance - amount);
      
      // 增加接收者余额
      const toBalance = this.balances.get(toAddress) || 0;
      this.balances.set(toAddress, toBalance + amount);

      // 创建转账交易记录
      const transaction = {
        type: 'transfer',
        from: fromUser.address,
        to: toAddress,
        amount,
        timestamp: new Date().toISOString(),
        txHash: this.generateTxHash()
      };

      console.log(`💸 转账成功:`);
      console.log(`从: ${fromUser.address}`);
      console.log(`到: ${toAddress}`);
      console.log(`数量: ${amount}`);
      console.log(`交易哈希: ${transaction.txHash}`);

      return transaction;
    } catch (error) {
      console.error('转账失败:', error);
      throw error;
    }
  }

  // 4. 矿工功能
  async addValidator(username, stake = 1000) {
    try {
      const user = this.wallets.get(username);
      if (!user) {
        throw new Error('用户不存在');
      }

      const validator = {
        address: user.address,
        username,
        stake,
        power: stake, // 投票权重
        status: 'active',
        blocks_proposed: 0,
        rewards_earned: 0,
        joined: new Date().toISOString()
      };

      this.validators.set(user.address, validator);

      console.log(`⛏️ 验证者添加成功:`);
      console.log(`用户: ${username}`);
      console.log(`地址: ${user.address}`);
      console.log(`质押: ${stake}`);

      return validator;
    } catch (error) {
      console.error('添加验证者失败:', error);
      throw error;
    }
  }

  // 挖矿奖励分发
  async distributeRewards() {
    const activeValidators = Array.from(this.validators.values())
      .filter(v => v.status === 'active');

    if (activeValidators.length === 0) return;

    const blockReward = 100; // 每个区块的总奖励
    const rewardPerValidator = Math.floor(blockReward / activeValidators.length);

    for (const validator of activeValidators) {
      await this.mintTokens(validator.address, rewardPerValidator, '区块奖励');
      validator.rewards_earned += rewardPerValidator;
      validator.blocks_proposed += 1;
    }

    console.log(`🎁 奖励分发完成，每个验证者获得 ${rewardPerValidator} 代币`);
  }

  // 生成新区块
  async mineBlock() {
    try {
      const block = {
        height: ++this.currentHeight,
        timestamp: new Date().toISOString(),
        hash: this.generateBlockHash(),
        previousHash: this.blocks.length > 0 ? this.blocks[this.blocks.length - 1].hash : '0',
        transactions: [],
        validator: this.selectValidator(),
        gasUsed: 0,
        gasLimit: 1000000
      };

      this.blocks.push(block);
      
      // 分发挖矿奖励
      await this.distributeRewards();

      console.log(`⛓️ 新区块生成:`);
      console.log(`高度: ${block.height}`);
      console.log(`哈希: ${block.hash}`);
      console.log(`验证者: ${block.validator}`);

      return block;
    } catch (error) {
      console.error('挖块失败:', error);
      throw error;
    }
  }

  // 选择验证者
  selectValidator() {
    const activeValidators = Array.from(this.validators.values())
      .filter(v => v.status === 'active');
    
    if (activeValidators.length === 0) return 'system';
    
    // 简单随机选择，实际中会根据权重选择
    const randomIndex = Math.floor(Math.random() * activeValidators.length);
    return activeValidators[randomIndex].address;
  }

  // 获取用户信息
  getUser(username) {
    const user = this.wallets.get(username);
    if (!user) return null;

    return {
      ...user,
      balance: this.balances.get(user.address) || 0
    };
  }

  // 获取账户余额
  getBalance(address) {
    return this.balances.get(address) || 0;
  }

  // 获取区块信息
  getBlock(height) {
    return this.blocks.find(block => block.height === height);
  }

  // 获取区块链状态
  getChainStatus() {
    return {
      chainId: this.chain_id,
      latestHeight: this.currentHeight,
      totalBlocks: this.blocks.length,
      totalSupply: this.totalSupply,
      activeValidators: Array.from(this.validators.values()).filter(v => v.status === 'active').length,
      totalUsers: this.wallets.size
    };
  }

  // 工具函数
  generateTxHash() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateBlockHash() {
    const data = `${this.currentHeight}-${Date.now()}-${Math.random()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // 初始化系统
  async initialize() {
    console.log('🚀 初始化Cosmos区块链系统...');
    
    // 创建创世区块
    const genesisBlock = {
      height: 0,
      timestamp: new Date().toISOString(),
      hash: 'genesis',
      previousHash: '0',
      transactions: [],
      validator: 'system',
      gasUsed: 0,
      gasLimit: 1000000
    };
    
    this.blocks.push(genesisBlock);
    
    // 创建系统水龙头用户
    const faucet = await this.createUser('faucet');
    this.faucetAddress = faucet.address;
    
    // 给水龙头铸造初始代币
    await this.mintTokens(faucet.address, 500000, '初始资金');
    
    console.log('✅ 区块链系统初始化完成');
    console.log(`💰 水龙头地址: ${this.faucetAddress}`);
  }
}

module.exports = CosmosBlockchain;