import React from 'react';
import { ValidatorCardProps } from '../types';
import { Shield, TrendingUp, Award, Clock } from 'lucide-react';

const ValidatorCard: React.FC<ValidatorCardProps> = ({ validator }) => {
  return (
    <div className="glass-card p-4 hover:bg-white/20 transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-white">{validator.username}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          validator.status === 'active' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {validator.status === 'active' ? '活跃' : '非活跃'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-white/80">
        <div className="flex items-center gap-2">
          <span className="font-medium">地址:</span>
          <span className="font-mono text-xs truncate">{validator.address}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">质押:</span>
          <span>{validator.stake} 代币</span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">投票权重:</span>
          <span>{validator.power}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">提议区块:</span>
          <span>{validator.blocks_proposed}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">获得奖励:</span>
          <span>{validator.rewards_earned} 代币</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">加入时间:</span>
          <span>{new Date(validator.joined).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ValidatorCard;