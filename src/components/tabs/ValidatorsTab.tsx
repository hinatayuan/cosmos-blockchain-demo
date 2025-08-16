import React, { useState, useEffect } from 'react';
import { Validator, ValidatorForm } from '../../types';
import { blockchainApi, handleApiError, getSuccessMessage } from '../../utils/api';
import ValidatorCard from '../ValidatorCard';
import { Shield, UserPlus, RefreshCw } from 'lucide-react';

interface ValidatorsTabProps {
  onRefreshStatus: () => void;
  showAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ValidatorsTab: React.FC<ValidatorsTabProps> = ({ onRefreshStatus, showAlert }) => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [validatorForm, setValidatorForm] = useState<ValidatorForm>({
    username: '',
    stake: 1000
  });
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadValidators = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const data = await blockchainApi.getValidators();
      setValidators(data);
    } catch (error) {
      showAlert('error', '加载验证者失败: ' + handleApiError(error));
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleAddValidator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatorForm.username.trim()) {
      showAlert('error', '请输入用户名');
      return;
    }

    setAddLoading(true);
    try {
      const response = await blockchainApi.addValidator(validatorForm);
      showAlert('success', getSuccessMessage('addValidator', response));
      setValidatorForm({ username: '', stake: 1000 });
      loadValidators();
      onRefreshStatus();
    } catch (error) {
      showAlert('error', handleApiError(error));
    } finally {
      setAddLoading(false);
    }
  };

  const handleRefresh = () => {
    loadValidators(true);
    onRefreshStatus();
  };

  useEffect(() => {
    loadValidators();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">验证者管理</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>
      
      {/* 添加验证者 */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          添加验证者
        </h3>
        
        <form onSubmit={handleAddValidator} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-white/80 mb-2">用户名</label>
            <input
              type="text"
              value={validatorForm.username}
              onChange={(e) => setValidatorForm({ ...validatorForm, username: e.target.value })}
              placeholder="要成为验证者的用户名"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">质押数量</label>
            <input
              type="number"
              min="1"
              value={validatorForm.stake}
              onChange={(e) => setValidatorForm({ ...validatorForm, stake: parseInt(e.target.value) || 1000 })}
              placeholder="1000"
              className="input-field"
            />
          </div>
          
          <button
            type="submit"
            disabled={addLoading}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {addLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Shield className="w-4 h-4" />
            )}
            添加验证者
          </button>
        </form>
      </div>

      {/* 验证者列表 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">当前验证者</h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : validators.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无验证者</p>
            <p className="text-sm mt-2">添加第一个验证者来开始挖矿</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {validators.map((validator) => (
              <ValidatorCard key={validator.address} validator={validator} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorsTab;