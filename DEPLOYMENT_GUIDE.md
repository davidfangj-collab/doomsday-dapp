# 🚀 Doomsday DApp 部署指南

## 📋 前置要求

1. **安装 Node.js** (v16 或更高版本)
2. **安装 MetaMask** 浏览器扩展
3. **获取 Sepolia 测试币**

## 🔧 配置步骤

### 1. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 2. 获取 Sepolia RPC URL

选择以下任一平台获取免费的 RPC URL：

- **Alchemy** (推荐): https://www.alchemy.com/
  1. 注册账号
  2. 创建新应用，选择 Ethereum -> Sepolia
  3. 复制 HTTPS URL

- **Infura**: https://infura.io/
- **QuickNode**: https://www.quicknode.com/

### 3. 获取 Sepolia 测试币

访问以下水龙头获取免费测试币（需要至少 0.1 ETH 用于部署）：

- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

### 4. 导出 MetaMask 私钥

⚠️ **警告：私钥非常重要，不要分享给任何人！**

1. 打开 MetaMask
2. 点击右上角菜单 -> 账户详情
3. 点击"导出私钥"
4. 输入密码并复制私钥

### 5. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
```

## 🚀 部署合约

运行部署脚本：

```bash
npx hardhat run scripts/deploy-messageboard.js --network sepolia
```

部署成功后，你会看到：
- ✅ 合约地址
- 🔗 Etherscan 链接
- 📝 自动更新的前端配置

## 🎨 启动前端

```bash
cd frontend
npm run dev
```

访问 http://localhost:3000

## 🌐 部署到 Vercel

### 方法 1: 通过 Git (推荐)

1. 将代码推送到 GitHub
2. 访问 https://vercel.com/
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测配置并部署

### 方法 2: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 📱 使用 DApp

1. **连接钱包**
   - 在 MetaMask 中切换到 Sepolia 测试网
   - 点击"连接钱包"按钮

2. **发布留言**
   - 输入留言内容（最多 280 字符）
   - 设置竞价金额（必须大于当前最低竞价）
   - 点击"发布留言"
   - 在 MetaMask 中确认交易

3. **查看排名**
   - 留言按竞价金额降序排列
   - 每 24 小时竞价自动衰减 50%
   - 只显示前 100 条留言

## 🔍 验证合约

在 Etherscan 上验证合约（可选）：

```bash
npx hardhat verify --network sepolia <合约地址>
```

## 🐛 常见问题

### 1. 部署失败：余额不足
- 确保账户有足够的 Sepolia ETH（至少 0.1 ETH）
- 从水龙头获取更多测试币

### 2. 交易失败：Gas 估算错误
- 检查 RPC URL 是否正确
- 尝试使用不同的 RPC 提供商

### 3. 前端无法连接合约
- 确认 MetaMask 已切换到 Sepolia 网络
- 检查 `App.jsx` 中的 `CONTRACT_ADDRESS` 是否正确
- 清除浏览器缓存并刷新页面

### 4. Vercel 部署 404
- 确保 `vercel.json` 配置正确
- 检查构建日志是否有错误
- 确认输出目录为 `frontend/dist`

## 📚 相关链接

- Sepolia Etherscan: https://sepolia.etherscan.io/
- Hardhat 文档: https://hardhat.org/docs
- Ethers.js 文档: https://docs.ethers.org/
- Vercel 文档: https://vercel.com/docs

## 💡 提示

- 使用测试网进行开发和测试
- 永远不要将私钥提交到 Git
- 定期备份你的私钥
- 在主网部署前进行充分测试

---

🔥 **Doomsday Message Board** - 基于以太坊的去中心化留言板

