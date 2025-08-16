import axios from 'axios';
import { 
  ChainStatus, 
  Block, 
  User, 
  Validator, 
  ApiResponse,
  CreateUserForm,
  TransferForm,
  MintForm,
  ValidatorForm
} from '../types';

const API_BASE_URL = '/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

// API 方法
export const blockchainApi = {
  // 获取区块链状态
  getStatus: (): Promise<ChainStatus> => 
    api.get('/status'),

  // 获取所有区块
  getBlocks: (): Promise<Block[]> => 
    api.get('/blocks'),

  // 获取特定区块
  getBlock: (height: number): Promise<Block> => 
    api.get(`/block/${height}`),

  // 获取用户信息
  getUser: (username: string): Promise<User> => 
    api.get(`/user/${username}`),

  // 获取地址余额
  getBalance: (address: string): Promise<{ address: string; balance: number }> => 
    api.get(`/balance/${address}`),

  // 获取验证者列表
  getValidators: (): Promise<Validator[]> => 
    api.get('/validators'),

  // 创建用户
  createUser: (data: CreateUserForm): Promise<ApiResponse> => 
    api.post('/user', data),

  // 转账
  transfer: (data: TransferForm): Promise<ApiResponse> => 
    api.post('/transfer', data),

  // 铸造代币
  mint: (data: MintForm): Promise<ApiResponse> => 
    api.post('/mint', data),

  // 添加验证者
  addValidator: (data: ValidatorForm): Promise<ApiResponse> => 
    api.post('/validator', data),

  // 挖矿
  mine: (): Promise<ApiResponse> => 
    api.post('/mine'),

  // 开始自动挖矿
  startAutoMining: (): Promise<ApiResponse> => 
    api.post('/auto-mine/start'),

  // 停止自动挖矿
  stopAutoMining: (): Promise<ApiResponse> => 
    api.post('/auto-mine/stop'),
};

// 错误处理工具
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return '未知错误';
};

// 成功提示工具
export const getSuccessMessage = (type: string, data?: any): string => {
  switch (type) {
    case 'createUser':
      return `用户 ${data?.user?.username} 创建成功！`;
    case 'transfer':
      return `转账成功！交易哈希: ${data?.transaction?.txHash}`;
    case 'mint':
      return `代币铸造成功！数量: ${data?.transaction?.amount}`;
    case 'addValidator':
      return `验证者 ${data?.validator?.username} 添加成功！`;
    case 'mine':
      return `区块挖矿成功！区块高度: ${data?.block?.height}`;
    case 'autoMineStart':
      return '自动挖矿已启动';
    case 'autoMineStop':
      return '自动挖矿已停止';
    default:
      return '操作成功！';
  }
};

export default api;