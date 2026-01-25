#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🔥 Doomsday Message Board - 启动脚本${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  未找到 .env 文件${NC}"
    echo ""
    echo -e "${YELLOW}请按照以下步骤配置：${NC}"
    echo -e "${NC}1. 复制 .env.template 为 .env${NC}"
    echo -e "${NC}2. 编辑 .env 文件，填入你的配置：${NC}"
    echo -e "${NC}   - SEPOLIA_RPC_URL: 从 Alchemy/Infura 获取${NC}"
    echo -e "${NC}   - PRIVATE_KEY: 从 MetaMask 导出${NC}"
    echo ""
    echo -e "${CYAN}📚 详细说明请查看 DEPLOYMENT_GUIDE.md${NC}"
    echo ""
    
    read -p "是否现在创建 .env 文件? (y/n) " create
    if [ "$create" = "y" ]; then
        cp .env.template .env
        echo -e "${GREEN}✅ 已创建 .env 文件，请编辑后重新运行此脚本${NC}"
        exit 0
    fi
    exit 1
fi

# 检查依赖
echo -e "${YELLOW}📦 检查依赖...${NC}"
if [ ! -d "node_modules" ]; then
    echo "正在安装根目录依赖..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "正在安装前端依赖..."
    cd frontend
    npm install
    cd ..
fi

echo -e "${GREEN}✅ 依赖检查完成${NC}"
echo ""

# 菜单
echo -e "${CYAN}请选择操作：${NC}"
echo "1. 编译合约"
echo "2. 部署到 Sepolia 测试网"
echo "3. 启动前端 (需要先部署合约)"
echo "4. 部署并启动 (推荐)"
echo "5. 运行测试"
echo "6. 退出"
echo ""

read -p "请输入选项 (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🔨 编译合约...${NC}"
        npm run compile
        echo ""
        echo -e "${GREEN}✅ 编译完成！${NC}"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🚀 部署到 Sepolia 测试网...${NC}"
        echo ""
        npm run deploy:sepolia
        echo ""
        echo -e "${GREEN}✅ 部署完成！${NC}"
        echo ""
        echo -e "${CYAN}📝 下一步：运行选项 3 启动前端${NC}"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}🎨 启动前端...${NC}"
        echo ""
        echo -e "${CYAN}前端将在 http://localhost:3000 启动${NC}"
        echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
        echo ""
        cd frontend
        npm run dev
        ;;
    4)
        echo ""
        echo -e "${YELLOW}🔨 步骤 1/3: 编译合约...${NC}"
        npm run compile
        
        echo ""
        echo -e "${YELLOW}🚀 步骤 2/3: 部署到 Sepolia...${NC}"
        npm run deploy:sepolia
        
        echo ""
        echo -e "${YELLOW}🎨 步骤 3/3: 启动前端...${NC}"
        echo ""
        echo -e "${CYAN}前端将在 http://localhost:3000 启动${NC}"
        echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
        echo ""
        sleep 2
        cd frontend
        npm run dev
        ;;
    5)
        echo ""
        echo -e "${YELLOW}🧪 运行测试...${NC}"
        npm test
        echo ""
        echo -e "${GREEN}✅ 测试完成！${NC}"
        ;;
    6)
        echo ""
        echo -e "${CYAN}👋 再见！${NC}"
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}❌ 无效选项${NC}"
        ;;
esac

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

