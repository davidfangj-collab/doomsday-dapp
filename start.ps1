# Doomsday DApp 启动脚本

Write-Host "🔥 Doomsday Message Board - 启动脚本" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 检查 .env 文件
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  未找到 .env 文件" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请按照以下步骤配置：" -ForegroundColor Yellow
    Write-Host "1. 复制 .env.template 为 .env" -ForegroundColor White
    Write-Host "2. 编辑 .env 文件，填入你的配置：" -ForegroundColor White
    Write-Host "   - SEPOLIA_RPC_URL: 从 Alchemy/Infura 获取" -ForegroundColor White
    Write-Host "   - PRIVATE_KEY: 从 MetaMask 导出" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 详细说明请查看 DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
    
    $create = Read-Host "是否现在创建 .env 文件? (y/n)"
    if ($create -eq "y") {
        Copy-Item ".env.template" ".env"
        Write-Host "✅ 已创建 .env 文件，请编辑后重新运行此脚本" -ForegroundColor Green
        notepad .env
    }
    exit
}

# 检查依赖
Write-Host "📦 检查依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安装根目录依赖..." -ForegroundColor White
    npm install
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "正在安装前端依赖..." -ForegroundColor White
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "✅ 依赖检查完成" -ForegroundColor Green
Write-Host ""

# 菜单
Write-Host "请选择操作：" -ForegroundColor Cyan
Write-Host "1. 编译合约" -ForegroundColor White
Write-Host "2. 部署到 Sepolia 测试网" -ForegroundColor White
Write-Host "3. 启动前端 (需要先部署合约)" -ForegroundColor White
Write-Host "4. 部署并启动 (推荐)" -ForegroundColor White
Write-Host "5. 运行测试" -ForegroundColor White
Write-Host "6. 退出" -ForegroundColor White
Write-Host ""

$choice = Read-Host "请输入选项 (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 编译合约..." -ForegroundColor Yellow
        npm run compile
        Write-Host ""
        Write-Host "✅ 编译完成！" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 部署到 Sepolia 测试网..." -ForegroundColor Yellow
        Write-Host ""
        npm run deploy:sepolia
        Write-Host ""
        Write-Host "✅ 部署完成！" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 下一步：运行选项 3 启动前端" -ForegroundColor Cyan
    }
    "3" {
        Write-Host ""
        Write-Host "🎨 启动前端..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "前端将在 http://localhost:3000 启动" -ForegroundColor Cyan
        Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
        Write-Host ""
        Set-Location frontend
        npm run dev
    }
    "4" {
        Write-Host ""
        Write-Host "🔨 步骤 1/3: 编译合约..." -ForegroundColor Yellow
        npm run compile
        
        Write-Host ""
        Write-Host "🚀 步骤 2/3: 部署到 Sepolia..." -ForegroundColor Yellow
        npm run deploy:sepolia
        
        Write-Host ""
        Write-Host "🎨 步骤 3/3: 启动前端..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "前端将在 http://localhost:3000 启动" -ForegroundColor Cyan
        Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
        Write-Host ""
        Start-Sleep -Seconds 2
        Set-Location frontend
        npm run dev
    }
    "5" {
        Write-Host ""
        Write-Host "🧪 运行测试..." -ForegroundColor Yellow
        npm test
        Write-Host ""
        Write-Host "✅ 测试完成！" -ForegroundColor Green
    }
    "6" {
        Write-Host ""
        Write-Host "👋 再见！" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host ""
        Write-Host "❌ 无效选项" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

