// 区块链相关类型定义
export interface User {
  username: string;
  address: string;
  mnemonic: string;
  balance: number;
  created: string;
}

export interface Block {
  height: number;
  timestamp: string;
  hash: string;
  previousHash: string;
  transactions: Transaction[];
  validator: string;
  gasUsed: number;
  gasLimit: number;
  transactionCount?: number;
}

export interface Transaction {
  type: 'mint' | 'transfer';
  from: string;
  to: string;
  amount: number;
  reason?: string;
  timestamp: string;
  txHash: string;
}

export interface Validator {
  address: string;
  username: string;
  stake: number;
  power: number;
  status: 'active' | 'inactive';
  blocks_proposed: number;
  rewards_earned: number;
  joined: string;
}

export interface ChainStatus {
  chainId: string;
  latestHeight: number;
  totalBlocks: number;
  totalSupply: number;
  activeValidators: number;
  totalUsers: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  user?: User;
  transaction?: Transaction;
  block?: Block;
  validator?: Validator;
  message?: string;
}

// 组件 Props 类型
export interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export interface BlockItemProps {
  block: Block;
}

export interface ValidatorCardProps {
  validator: Validator;
}

export interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

// 表单类型
export interface CreateUserForm {
  username: string;
}

export interface TransferForm {
  fromUsername: string;
  toAddress: string;
  amount: number;
}

export interface MintForm {
  toAddress: string;
  amount: number;
  reason: string;
}

export interface ValidatorForm {
  username: string;
  stake: number;
}

// Hook 状态类型
export interface UseBlockchainState {
  status: ChainStatus | null;
  blocks: Block[];
  validators: Validator[];
  loading: boolean;
  error: string | null;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}