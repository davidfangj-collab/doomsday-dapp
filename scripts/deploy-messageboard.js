const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 开始部署 MessageBoard 合约到 Sepolia 测试网...\n");

  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);

  // 获取账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ 错误：账户余额为 0，请先获取 Sepolia 测试币");
    console.log("💡 获取测试币：https://sepoliafaucet.com/");
    process.exit(1);
  }

  // 部署合约
  console.log("⏳ 正在部署合约...");
  const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.deploy();

  await messageBoard.waitForDeployment();
  const contractAddress = await messageBoard.getAddress();

  console.log("✅ MessageBoard 合约已部署!");
  console.log("📍 合约地址:", contractAddress);
  console.log("🔗 在 Etherscan 上查看:", `https://sepolia.etherscan.io/address/${contractAddress}\n`);

  // 更新前端配置
  const appJsxPath = path.join(__dirname, "../frontend/src/App.jsx");
  
  try {
    let appContent = fs.readFileSync(appJsxPath, "utf8");
    
    // 替换合约地址
    const oldAddressPattern = /const CONTRACT_ADDRESS = ["']0x[a-fA-F0-9]{40}["']/;
    const newAddress = `const CONTRACT_ADDRESS = "${contractAddress}"`;
    
    if (oldAddressPattern.test(appContent)) {
      appContent = appContent.replace(oldAddressPattern, newAddress);
      fs.writeFileSync(appJsxPath, appContent);
      console.log("✅ 已更新前端配置文件中的合约地址\n");
    } else {
      console.log("⚠️  未找到合约地址配置，请手动更新 App.jsx 中的 CONTRACT_ADDRESS\n");
    }
  } catch (error) {
    console.log("⚠️  更新前端配置失败:", error.message);
    console.log("请手动更新 frontend/src/App.jsx 中的 CONTRACT_ADDRESS\n");
  }

  // 验证合约
  console.log("📋 部署信息摘要:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("合约地址:", contractAddress);
  console.log("网络:", hre.network.name);
  console.log("部署者:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🎉 部署完成！");
  console.log("\n📝 下一步操作:");
  console.log("1. 在 MetaMask 中切换到 Sepolia 测试网");
  console.log("2. 运行 'npm start' 启动前端");
  console.log("3. 访问 http://localhost:3000 测试 DApp\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
