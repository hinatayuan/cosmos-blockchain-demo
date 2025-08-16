import React, { useState } from 'react';
import { blockchainApi, handleApiError, getSuccessMessage } from '../../utils/api';
import { Hammer, Play, Square, Zap } from 'lucide-react';

interface MiningTabProps {
  onRefreshStatus: () => void;
  showAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const MiningTab: React.FC<MiningTabProps> = ({ onRefreshStatus, showAlert }) => {
  const [autoMining, setAutoMining] = useState(false);
  const [mineLoading, setMineLoading] = useState(false);
  const [autoMineLoading, setAutoMineLoading] = useState(false);

  const handleMineBlock = async () => {
    setMineLoading(true);
    try {
      const response = await blockchainApi.mine();
      showAlert('success', getSuccessMessage('mine', response));
      onRefreshStatus();
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setMineLoading(false);
    }
  };

  const handleStartAutoMining = async () => {
    setAutoMineLoading(true);
    try {
      await blockchainApi.startAutoMining();
      setAutoMining(true);
      showAlert('success', getSuccessMessage('autoMineStart'));
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setAutoMineLoading(false);
    }
  };

  const handleStopAutoMining = async () => {
    setAutoMineLoading(true);
    try {
      await blockchainApi.stopAutoMining();
      setAutoMining(false);
      showAlert('success', getSuccessMessage('autoMineStop'));
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setAutoMineLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">挖矿管理</h2>
      
      <div className="space-y-6">
        {/* 自动挖矿状态 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${autoMining ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-white font-medium">
              自动挖矿状态: {autoMining ? '运行中' : '已停止'}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleStartAutoMining}
              disabled={autoMining || autoMineLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {autoMineLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="w-4 h-4" />
              )}
              开始自动挖矿
            </button>
            
            <button
              onClick={handleStopAutoMining}
              disabled={!autoMining || autoMineLoading}
              className="btn-danger flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {autoMineLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Square className="w-4 h-4" />
              )}
              停止自动挖矿
            </button>
          </div>
          
          <p className="text-white/60 text-sm mt-3">
            自动挖矿将每10秒生成一个新区块，并自动分发奖励给活跃验证者。
          </p>
        </div>

        {/* 手动挖矿 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Hammer className="w-5 h-5" />
            手动挖矿
          </h3>
          
          <button
            onClick={handleMineBlock}
            disabled={mineLoading}
            className="btn-secondary flex items-center gap-2"
          >
            {mineLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Zap className="w-4 h-4" />
            )}
            挖一个区块
          </button>
          
          <p className="text-white/60 text-sm mt-3">
            手动挖矿将立即生成一个新区块，验证者将获得挖矿奖励。
          </p>
        </div>

        {/* 挖矿说明 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">挖矿机制说明</h3>
          
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cosmos-400 rounded-full mt-2"></div>
              <div>
                <strong>区块生成:</strong> 每个区块包含时间戳、哈希、验证者信息等
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cosmos-400 rounded-full mt-2"></div>
              <div>
                <strong>验证者选择:</strong> 系统随机选择活跃验证者来生成区块
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cosmos-400 rounded-full mt-2"></div>
              <div>
                <strong>奖励分发:</strong> 每个区块奖励100代币，平均分配给所有活跃验证者
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cosmos-400 rounded-full mt-2"></div>
              <div>
                <strong>安全性:</strong> 使用SHA256哈希算法确保区块链安全性
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningTab;