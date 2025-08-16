import React, { useState } from 'react';
import { User, CreateUserForm } from '../../types';
import { blockchainApi, handleApiError, getSuccessMessage } from '../../utils/api';
import { UserPlus, Search, Copy } from 'lucide-react';

interface UsersTabProps {
  onRefreshStatus: () => void;
  showAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ onRefreshStatus, showAlert }) => {
  const [createForm, setCreateForm] = useState<CreateUserForm>({ username: '' });
  const [queryUsername, setQueryUsername] = useState('');
  const [queriedUser, setQueriedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.username.trim()) {
      showAlert('error', '请输入用户名');
      return;
    }

    setLoading(true);
    try {
      const response = await blockchainApi.createUser(createForm);
      showAlert('success', getSuccessMessage('createUser', response));
      setCreateForm({ username: '' });
      onRefreshStatus();
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleQueryUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryUsername.trim()) {
      showAlert('error', '请输入用户名');
      return;
    }

    setQueryLoading(true);
    try {
      const user = await blockchainApi.getUser(queryUsername);
      setQueriedUser(user);
    } catch (error) {
      showAlert('error', handleApiError(error));
      setQueriedUser(null);
    } finally {
      setQueryLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showAlert('success', '已复制到剪贴板');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">用户管理</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 创建用户 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            创建新用户
          </h3>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">用户名</label>
              <input
                type="text"
                value={createForm.username}
                onChange={(e) => setCreateForm({ username: e.target.value })}
                placeholder="输入用户名"
                className="input-field"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              创建用户
            </button>
          </form>
        </div>

        {/* 查询用户 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            查询用户
          </h3>
          
          <form onSubmit={handleQueryUser} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">用户名</label>
              <input
                type="text"
                value={queryUsername}
                onChange={(e) => setQueryUsername(e.target.value)}
                placeholder="输入要查询的用户名"
                className="input-field"
              />
            </div>
            
            <button
              type="submit"
              disabled={queryLoading}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {queryLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              查询用户
            </button>
          </form>
        </div>
      </div>

      {/* 查询结果 */}
      {queriedUser && (
        <div className="glass-card p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">用户信息</h3>
          
          <div className="space-y-3 text-white/80">
            <div className="flex items-center justify-between">
              <span className="font-medium">用户名:</span>
              <span>{queriedUser.username}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">地址:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm truncate max-w-xs">{queriedUser.address}</span>
                <button
                  onClick={() => copyToClipboard(queriedUser.address)}
                  className="text-cosmos-300 hover:text-cosmos-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">余额:</span>
              <span>{queriedUser.balance} 代币</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">创建时间:</span>
              <span>{new Date(queriedUser.created).toLocaleString()}</span>
            </div>
            
            <div className="mt-4">
              <span className="font-medium">助记词:</span>
              <div className="mt-2 p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{queriedUser.mnemonic}</span>
                  <button
                    onClick={() => copyToClipboard(queriedUser.mnemonic)}
                    className="text-cosmos-300 hover:text-cosmos-200 transition-colors ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-yellow-300 mt-2">⚠️ 请安全保存助记词，不要泄露给他人</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;