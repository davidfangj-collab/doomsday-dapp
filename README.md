# 🔥 Doomsday Message Board

一个基于以太坊的去中心化留言板 DApp，采用竞价排名机制和时间衰减算法。

## ✨ 特性

- 🏆 **竞价排名**：出价越高，排名越靠前
- ⏰ **时间衰减**：每 24 小时竞价自动衰减 50%
- 📊 **Top 100**：只显示前 100 条留言
- 🎨 **现代 UI**：使用 Framer Motion 动画效果
- 🔐 **完全去中心化**：智能合约部署在以太坊上

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 2. 配置环境变量

复制 `.env.template` 为 `.env`：

```bash
cp .env.template .env
```

编辑 `.env` 文件，填入你的配置：

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
```

**获取 RPC URL：**
- [Alchemy](https://www.alchemy.com/) (推荐)
- [Infura](https://infura.io/)
- [QuickNode](https://www.quicknode.com/)

**获取测试币：**
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

### 3. 编译合约

```bash
npm run compile
```

### 4. 部署到 Sepolia 测试网

```bash
npm run deploy:sepolia
```

部署成功后，合约地址会自动更新到前端配置文件。

### 5. 启动前端

```bash
npm start
```

访问 http://localhost:3000

## 📁 项目结构

```
doomsday-dapp/
├── contracts/              # 智能合约
│   └── MessageBoard.sol   # 留言板合约
├── scripts/               # 部署脚本
│   └── deploy-messageboard.js
├── test/                  # 测试文件
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── App.jsx       # 主应用组件
│   │   ├── App.css       # 样式文件
│   │   └── main.jsx      # 入口文件
│   └── index.html
├── hardhat.config.js      # Hardhat 配置
├── vercel.json           # Vercel 部署配置
└── package.json
```

## 🛠️ 可用命令

```bash
# 编译合约
npm run compile

# 运行测试
npm test

# 部署到 Sepolia
npm run deploy:sepolia

# 部署到本地网络
npm run deploy:local

# 启动本地节点
npm run node

# 启动前端
npm start
```

## 🌐 部署到 Vercel

### 方法 1: 通过 Git

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com/)
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测配置并部署

### 方法 2: 使用 CLI

```bash
npm i -g vercel
vercel
```

## 📝 智能合约功能

### 主要函数

- `addMessage(string content, bytes32 messageId)` - 发布留言
- `getMessages()` - 获取所有留言
- `getMessagesPaginated(uint256 page, uint256 pageSize)` - 分页获取留言
- `getMinimumBidForTop100()` - 获取进入前 100 的最低竞价
- `getMessageCount()` - 获取留言总数

### 衰减机制

- 每 24 小时竞价自动衰减 50%
- 衰减公式：`新竞价 = 原竞价 × (100 - 50) / 100`
- 多个周期累积衰减

## 🎨 前端技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Ethers.js** - 以太坊交互
- **Framer Motion** - 动画效果
- **Lucide React** - 图标库

## 🔐 安全提示

- ⚠️ 永远不要将私钥提交到 Git
- ⚠️ 不要在主网使用测试私钥
- ⚠️ 定期备份你的私钥
- ⚠️ 使用硬件钱包存储大额资金

## 📚 相关链接

- [Hardhat 文档](https://hardhat.org/docs)
- [Ethers.js 文档](https://docs.ethers.org/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Vercel 文档](https://vercel.com/docs)

## 📄 许可证

MIT License

---

Made with 🔥 by Doomsday Team
