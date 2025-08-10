# 部署说明

## GitHub Pages 自动部署

本项目配置了 GitHub Actions 工作流，当推送代码到 `main` 或 `master` 分支时会自动构建并部署到 GitHub Pages。

### 设置步骤

1. **启用 GitHub Pages**
   - 进入仓库设置 (Settings)
   - 找到 Pages 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 `gh-pages`，文件夹选择 `/ (root)`
   - 点击 Save

2. **配置权限**
   - 进入仓库设置 (Settings) > Actions > General
   - 在 "Workflow permissions" 部分选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"

### 工作流说明

- **PR Check**: 在 Pull Request 时运行代码检查和测试
- **Build and Deploy**: 在推送到主分支时构建并部署

### 手动部署

如果需要手动部署，可以运行：

```bash
npm run release
```

构建文件将生成在 `build/` 目录中。

### 访问地址

部署完成后，应用将在以下地址可用：
`https://[用户名].github.io/[仓库名]/` 