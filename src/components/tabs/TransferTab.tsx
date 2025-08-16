import React, { useState } from 'react';
import { TransferForm, MintForm } from '../../types';
import { blockchainApi, handleApiError, getSuccessMessage } from '../../utils/api';
import { ArrowRightLeft, Coins, Send } from 'lucide-react';

interface TransferTabProps {
  onRefreshStatus: () => void;
  showAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const TransferTab: React.FC<TransferTabProps> = ({ onRefreshStatus, showAlert }) => {
  const [transferForm, setTransferForm] = useState<TransferForm>({
    fromUsername: '',
    toAddress: '',
    amount: 0
  });
  
  const [mintForm, setMintForm] = useState<MintForm>({
    toAddress: '',
    amount: 0,
    reason: '管理员铸造'
  });
  
  const [transferLoading, setTransferLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.fromUsername || !transferForm.toAddress || !transferForm.amount) {
      showAlert('error', '请填写完整信息');
      return;
    }

    setTransferLoading(true);
    try {
      const response = await blockchainApi.transfer(transferForm);
      showAlert('success', getSuccessMessage('transfer', response));
      setTransferForm({ fromUsername: '', toAddress: '', amount: 0 });
      onRefreshStatus();
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setTransferLoading(false);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintForm.toAddress || !mintForm.amount) {
      showAlert('error', '请填写完整信息');
      return;
    }

    setMintLoading(true);
    try {
      const response = await blockchainApi.mint(mintForm);
      showAlert('success', getSuccessMessage('mint', response));
      setMintForm({ toAddress: '', amount: 0, reason: '管理员铸造' });
      onRefreshStatus();
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">代币转账</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 转账 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            转账
          </h3>
          
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">发送者用户名</label>
              <input
                type="text"
                value={transferForm.fromUsername}
                onChange={(e) => setTransferForm({ ...transferForm, fromUsername: e.target.value })}
                placeholder="发送者用户名"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">接收者地址</label>
              <input
                type="text"
                value={transferForm.toAddress}
                onChange={(e) => setTransferForm({ ...transferForm, toAddress: e.target.value })}
                placeholder="接收者地址"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">转账数量</label>
              <input
                type="number"
                min="1"
                value={transferForm.amount || ''}
                onChange={(e) => setTransferForm({ ...transferForm, amount: parseInt(e.target.value) || 0 })}
                placeholder="转账数量"
                className="input-field"
              />
            </div>
            
            <button
              type="submit"
              disabled={transferLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {transferLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              发起转账
            </button>
          </form>
        </div>

        {/* 铸造代币 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5" />
            铸造代币
          </h3>
          
          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">接收地址</label>
              <input
                type="text"
                value={mintForm.toAddress}
                onChange={(e) => setMintForm({ ...mintForm, toAddress: e.target.value })}
                placeholder="接收地址"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">铸造数量</label>
              <input
                type="number"
                min="1"
                value={mintForm.amount || ''}
                onChange={(e) => setMintForm({ ...mintForm, amount: parseInt(e.target.value) || 0 })}
                placeholder="铸造数量"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">铸造原因</label>
              <input
                type="text"
                value={mintForm.reason}
                onChange={(e) => setMintForm({ ...mintForm, reason: e.target.value })}
                placeholder="铸造原因"
                className="input-field"
              />
            </div>
            
            <button
              type="submit"
              disabled={mintLoading}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {mintLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Coins className="w-4 h-4" />
              )}
              铸造代币
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferTab;