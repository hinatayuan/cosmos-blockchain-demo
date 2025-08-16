import React, { useState, useEffect } from 'react';
import { Block } from '../../types';
import { blockchainApi, handleApiError } from '../../utils/api';
import BlockItem from '../BlockItem';
import { RefreshCw } from 'lucide-react';

interface BlocksTabProps {
  onRefreshStatus: () => void;
  showAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const BlocksTab: React.FC<BlocksTabProps> = ({ onRefreshStatus, showAlert }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBlocks = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const data = await blockchainApi.getBlocks();
      setBlocks(data);
    } catch (error) {
      showAlert('error', '加载区块失败: ' + handleApiError(error));
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadBlocks(true);
    onRefreshStatus();
  };

  useEffect(() => {
    loadBlocks();
    const interval = setInterval(() => loadBlocks(), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">最新区块</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <p>暂无区块数据</p>
          </div>
        ) : (
          blocks.map((block) => (
            <BlockItem key={block.height} block={block} />
          ))
        )}
      </div>
    </div>
  );
};

export default BlocksTab;