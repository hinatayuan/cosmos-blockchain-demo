// server/blockchain-persistent.js - 支持数据持久化的区块链实现
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const crypto = require('crypto');
const bip39 = require('bip39');
const fs = require('fs');
const path = require('path');

class PersistentCosmosBlockchain {
  constructor() {
    this.chain_id = 'mychain-1';
    this.rpc_endpoint = 'http://localhost:26657';
    this.wallets = new Map();
    this.blocks = [];
    this.currentHeight = 0;
    this.validators = new Map();
    this.totalSupply = 1000000;
    this.balances = new Map();
    this.faucetAddress = null;
    
    // 数据持久化文件路径
    this.dataDir = path.join(__dirname, 'blockchain-data');
    this.dataFile = path.join(this.dataDir, 'blockchain.json');
  }

  // 保存数据到文件
  async saveData() {
    try {
      // 确保数据目录存在
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const data = {
        chain_id: this.chain_id,
        blocks: this.blocks,
        currentHeight: this.currentHeight,
        totalSupply: this.totalSupply,
        faucetAddress: this.faucetAddress,
        // 将 Map 转换为对象以便序列化
        wallets: Object.fromEntries(this.wallets),
        validators: Object.fromEntries(this.validators),
        balances: Object.fromEntries(this.balances),
        lastSaved: new Date().toISOString()
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
      console.log('💾 区块链数据已保存');
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  // 从文件加载数据
  async loadData() {
    try {
      if (!fs.existsSync(this.dataFile)) {
        console.log('📂 未找到现有数据文件，将创建新的区块链');
        return false;
      }

      const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
      
      this.chain_id = data.chain_id || this.chain_id;
      this.blocks = data.blocks || [];
      this.currentHeight = data.currentHeight || 0;
      this.totalSupply = data.totalSupply || 1000000;
      this.faucetAddress = data.faucetAddress;
      
      // 将对象转换回 Map
      this.wallets = new Map(Object.entries(data.wallets || {}));
      this.validators = new Map(Object.entries(data.validators || {}));
      this.balances = new Map(Object.entries(data.balances || {}));

      console.log('📥 区块链数据加载成功');
      console.log(`📊 加载了 ${this.blocks.length} 个区块，${this.wallets.size} 个用户`);
      return true;
    } catch (error) {
      console.error('加载数据失败:', error);
      return false;
    }
  }

  // 清除所有持久化数据
  async clearData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        fs.unlinkSync(this.dataFile);
        console.log('🗑️ 持久化数据已清除');
      }
    } catch (error) {
      console.error('清除数据失败:', error);
    }
  }

  // 1. 创建新用户/钱包
  async createUser(username) {
    try {
      const mnemonic = bip39.generateMnemonic();
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: 'cosmos',
      });

      const [firstAccount] = await wallet.getAccounts();
      const address = firstAccount.address;

      const user = {
        username,
        address,
        mnemonic,
        balance: 0,
        created: new Date().toISOString()
      };

      this.wallets.set(username, user);
      this.balances.set(address, 0);

      // 自动保存数据
      await this.saveData();

      console.log(`✅ 用户创建成功: ${username} (${address})`);
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

      const transaction = {
        type: 'mint',
        from: 'system',
        to: toAddress,
        amount,
        reason,
        timestamp: new Date().toISOString(),
        txHash: this.generateTxHash()
      };

      // 自动保存数据
      await this.saveData();

      console.log(`🪙 代币铸造成功: ${amount} -> ${toAddress}`);
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

      this.balances.set(fromUser.address, fromBalance - amount);
      const toBalance = this.balances.get(toAddress) || 0;
      this.balances.set(toAddress, toBalance + amount);

      const transaction = {
        type: 'transfer',
        from: fromUser.address,
        to: toAddress,
        amount,
        timestamp: new Date().toISOString(),
        txHash: this.generateTxHash()
      };

      // 自动保存数据
      await this.saveData();

      console.log(`💸 转账成功: ${amount} (${fromUser.address} -> ${toAddress})`);
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
        power: stake,
        status: 'active',
        blocks_proposed: 0,
        rewards_earned: 0,
        joined: new Date().toISOString()
      };

      this.validators.set(user.address, validator);

      // 自动保存数据
      await this.saveData();

      console.log(`⛏️ 验证者添加成功: ${username}`);
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

    const blockReward = 100;
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
      await this.distributeRewards();

      // 自动保存数据
      await this.saveData();

      console.log(`⛓️ 新区块生成: #${block.height}`);
      return block;
    } catch (error) {
      console.error('挖块失败:', error);
      throw error;
    }
  }

  // 其他方法保持不变...
  selectValidator() {
    const activeValidators = Array.from(this.validators.values())
      .filter(v => v.status === 'active');
    
    if (activeValidators.length === 0) return 'system';
    
    const randomIndex = Math.floor(Math.random() * activeValidators.length);
    return activeValidators[randomIndex].address;
  }

  getUser(username) {
    const user = this.wallets.get(username);
    if (!user) return null;

    return {
      ...user,
      balance: this.balances.get(user.address) || 0
    };
  }

  getBalance(address) {
    return this.balances.get(address) || 0;
  }

  getBlock(height) {
    return this.blocks.find(block => block.height === height);
  }

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

  generateTxHash() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateBlockHash() {
    const data = `${this.currentHeight}-${Date.now()}-${Math.random()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // 初始化系统（支持持久化）
  async initialize() {
    console.log('🚀 初始化Cosmos区块链系统...');
    
    // 尝试加载现有数据
    const dataLoaded = await this.loadData();
    
    if (!dataLoaded) {
      // 如果没有现有数据，创建新的区块链
      console.log('🆕 创建新的区块链...');
      
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
      
      const faucet = await this.createUser('faucet');
      this.faucetAddress = faucet.address;
      
      await this.mintTokens(faucet.address, 500000, '初始资金');
      
      console.log('✅ 新区块链创建完成');
    } else {
      console.log('♻️ 现有区块链加载完成');
    }
    
    console.log(`💰 水龙头地址: ${this.faucetAddress}`);
  }
}

module.exports = PersistentCosmosBlockchain;