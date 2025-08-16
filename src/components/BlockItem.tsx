import React from 'react';
import { BlockItemProps } from '../types';
import { Clock, Hash, User, Zap } from 'lucide-react';

const BlockItem: React.FC<BlockItemProps> = ({ block }) => {
  return (
    <div className="glass-card p-4 mb-4 hover:bg-white/20 transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-cosmos-300">
          区块 #{block.height}
        </h3>
        <div className="flex items-center gap-1 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          {new Date(block.timestamp).toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <Hash className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">哈希:</span>
          <span className="font-mono text-xs truncate">{block.hash}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <User className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">验证者:</span>
          <span className="font-mono text-xs truncate">{block.validator}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <Zap className="w-4 h-4 text-cosmos-300" />
          <span className="font-medium">交易数:</span>
          <span>{block.transactionCount || 0}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <span className="font-medium">Gas:</span>
          <span>{block.gasUsed}/{block.gasLimit}</span>
        </div>
      </div>
    </div>
  );
};

export default BlockItem;