// server/test.js - 测试脚本
const CosmosBlockchain = require('./blockchain');

async function runTests() {
  console.log('🧪 开始测试 Cosmos 区块链系统...\n');
  
  const blockchain = new CosmosBlockchain();
  
  try {
    // 初始化系统
    console.log('1. 初始化区块链系统');
    await blockchain.initialize();
    console.log('✅ 初始化完成\n');
    
    // 测试创建用户
    console.log('2. 测试用户创建');
    const alice = await blockchain.createUser('alice');
    const bob = await blockchain.createUser('bob');
    const charlie = await blockchain.createUser('charlie');
    console.log('✅ 用户创建测试完成\n');
    
    // 测试代币铸造
    console.log('3. 测试代币铸造');
    await blockchain.mintTokens(alice.address, 1000, '测试铸造');
    await blockchain.mintTokens(bob.address, 500, '测试铸造');
    console.log('✅ 代币铸造测试完成\n');
    
    // 测试代币转账
    console.log('4. 测试代币转账');
    await blockchain.transferTokens('alice', bob.address, 200);
    await blockchain.transferTokens('bob', charlie.address, 100);
    console.log('✅ 代币转账测试完成\n');
    
    // 测试添加验证者
    console.log('5. 测试添加验证者');
    await blockchain.addValidator('alice', 1000);
    await blockchain.addValidator('bob', 1500);
    console.log('✅ 验证者测试完成\n');
    
    // 测试挖矿
    console.log('6. 测试挖矿');
    for (let i = 0; i < 5; i++) {
      await blockchain.mineBlock();
    }
    console.log('✅ 挖矿测试完成\n');
    
    // 显示最终状态
    console.log('7. 最终状态报告');
    console.log('================');
    
    const status = blockchain.getChainStatus();
    console.log('区块链状态:', status);
    
    console.log('\n用户余额:');
    for (const [username, user] of blockchain.wallets) {
      console.log(`${username}: ${blockchain.getBalance(user.address)} 代币`);
    }
    
    console.log('\n验证者信息:');
    for (const [address, validator] of blockchain.validators) {
      console.log(`${validator.username}: 质押 ${validator.stake}, 奖励 ${validator.rewards_earned}`);
    }
    
    console.log('\n最新区块:');
    const latestBlocks = blockchain.blocks.slice(-3);
    latestBlocks.forEach(block => {
      console.log(`区块 #${block.height}: ${block.hash.substring(0, 16)}...`);
    });
    
    console.log('\n🎉 所有测试通过！区块链系统运行正常。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
if (require.main === module) {
  runTests();
}

module.exports = runTests;