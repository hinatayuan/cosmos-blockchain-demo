import React, { useState, useEffect } from 'react';
import { 
  Blocks, 
  Users, 
  ArrowRightLeft, 
  Pickaxe, 
  Shield,
  Activity,
  Coins,
  Database,
  TrendingUp,
  Network
} from 'lucide-react';
import { ChainStatus } from './types';
import { blockchainApi, handleApiError } from './utils/api';
import StatusCard from './components/StatusCard';
import TabButton from './components/TabButton';
import BlocksTab from './components/tabs/BlocksTab';
import UsersTab from './components/tabs/UsersTab';
import TransferTab from './components/tabs/TransferTab';
import MiningTab from './components/tabs/MiningTab';
import ValidatorsTab from './components/tabs/ValidatorsTab';
import Alert from './components/Alert';

type TabType = 'blocks' | 'users' | 'transfer' | 'mining' | 'validators';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('blocks');
  const [status, setStatus] = useState<ChainStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // 加载区块链状态
  const loadStatus = async () => {
    try {
      const data = await blockchainApi.getStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // 显示提示信息
  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // 初始化和定时刷新
  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000); // 每30秒刷新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmos-600 via-purple-600 to-cosmos-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="glass-card p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Network className="w-8 h-8 text-cosmos-300" />
            Cosmos 区块链浏览器
          </h1>
          <p className="text-white/80">基于 Cosmos JS SDK 的区块链演示系统 - React + TypeScript</p>
          
          {/* Status Cards */}
          {loading ? (
            <div className="flex justify-center mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">加载失败: {error}</p>
            </div>
          ) : status ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <StatusCard
                title="当前高度"
                value={status.latestHeight}
                icon={<Activity className="w-5 h-5" />}
              />
              <StatusCard
                title="总区块数"
                value={status.totalBlocks}
                icon={<Database className="w-5 h-5" />}
              />
              <StatusCard
                title="代币总供应"
                value={status.totalSupply.toLocaleString()}
                icon={<Coins className="w-5 h-5" />}
              />
              <StatusCard
                title="活跃验证者"
                value={status.activeValidators}
                icon={<Shield className="w-5 h-5" />}
              />
              <StatusCard
                title="总用户数"
                value={status.totalUsers}
                icon={<Users className="w-5 h-5" />}
              />
            </div>
          ) : null}
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Tabs */}
        <div className="glass-card mb-6 overflow-hidden">
          <div className="flex flex-wrap">
            <TabButton
              active={activeTab === 'blocks'}
              onClick={() => setActiveTab('blocks')}
              icon={<Blocks className="w-4 h-4" />}
            >
              区块浏览
            </TabButton>
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<Users className="w-4 h-4" />}
            >
              用户管理
            </TabButton>
            <TabButton
              active={activeTab === 'transfer'}
              onClick={() => setActiveTab('transfer')}
              icon={<ArrowRightLeft className="w-4 h-4" />}
            >
              代币转账
            </TabButton>
            <TabButton
              active={activeTab === 'mining'}
              onClick={() => setActiveTab('mining')}
              icon={<Pickaxe className="w-4 h-4" />}
            >
              挖矿管理
            </TabButton>
            <TabButton
              active={activeTab === 'validators'}
              onClick={() => setActiveTab('validators')}
              icon={<Shield className="w-4 h-4" />}
            >
              验证者
            </TabButton>
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-card p-6 min-h-[600px]">
          {activeTab === 'blocks' && (
            <BlocksTab onRefreshStatus={loadStatus} showAlert={showAlert} />
          )}
          {activeTab === 'users' && (
            <UsersTab onRefreshStatus={loadStatus} showAlert={showAlert} />
          )}
          {activeTab === 'transfer' && (
            <TransferTab onRefreshStatus={loadStatus} showAlert={showAlert} />
          )}
          {activeTab === 'mining' && (
            <MiningTab onRefreshStatus={loadStatus} showAlert={showAlert} />
          )}
          {activeTab === 'validators' && (
            <ValidatorsTab onRefreshStatus={loadStatus} showAlert={showAlert} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60">
          <p>© 2024 Cosmos 区块链演示项目 - 基于 React + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;