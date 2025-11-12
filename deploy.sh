#!/bin/bash

echo "🚀 开始部署立体几何教学应用到 Vercel..."

# 检查是否已安装Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署到Vercel
echo "📤 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"