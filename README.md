# SolidGeometry - 立体几何教学应用

一个面向中学生的立体几何学习工具，通过3D可视化模型帮助理解抽象的几何概念。

## 🎯 功能特色

- **3D可视化展示**：使用Three.js渲染真实的3D几何模型
- **交互式学习**：支持模型旋转、缩放、参数调节
- **本地数据存储**：学习进度和练习记录保存在本地
- **离线使用**：无需网络连接，完全本地运行
- **零成本部署**：使用GitHub Pages免费托管

## 📚 支持的几何体

- **基础几何体**：立方体、球体、圆柱体
- **进阶几何体**：圆锥体、圆环体、四面体

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **3D渲染**：Three.js
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **本地存储**：LocalStorage + IndexedDB

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 本地预览

构建完成后，可以使用以下命令本地预览：

```bash
npm install -g serve
serve dist
```

## 📁 项目结构

```
src/
├── components/     # React组件
├── pages/         # 页面组件
├── utils/         # 工具函数
├── data/          # 几何体数据配置
├── types/         # TypeScript类型定义
└── hooks/         # 自定义Hooks
```

## 🎮 使用说明

1. **首页浏览**：查看所有几何体分类和学习进度
2. **3D查看**：点击"3D查看"进入交互式模型展示页面
3. **参数调节**：使用滑块实时调整几何体参数
4. **知识学习**：点击"学习"查看公式、性质和练习题
5. **进度跟踪**：在"学习进度"页面查看学习统计

## 📊 数据管理

- **学习进度**：自动记录访问次数和掌握程度
- **练习记录**：保存每道练习题的结果
- **本地导出**：支持导出学习数据为JSON文件
- **数据清除**：可一键清除所有学习数据

## 🌐 部署方案

### GitHub Pages（推荐）

1. Fork本项目到你的GitHub账号
2. 在仓库设置中启用GitHub Pages
3. 选择`gh-pages`分支作为源
4. 访问`https://[你的用户名].github.io/[仓库名]`

### 其他静态托管

构建后的`dist`文件夹可以部署到任何静态文件托管服务：
- Netlify
- Vercel
- 阿里云OSS
- 腾讯云COS

## 📱 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 开发说明

### 添加新的几何体

1. 在`src/data/geometryData.ts`中添加配置
2. 在`src/utils/threeUtils.ts`中添加创建函数
3. 更新相关的类型定义

### 自定义样式

项目使用Tailwind CSS，可以通过修改`tailwind.config.js`来自定义主题。

## 📄 许可证

MIT License - 详见LICENSE文件

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 联系

如有问题或建议，请通过GitHub Issue联系。