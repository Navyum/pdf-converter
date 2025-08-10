# PDF to Markdown Converter

一个强大的 PDF 到 Markdown 转换工具，基于 React + TypeScript 构建，提供直观的 Web 界面和精确的文档结构识别。

## 🚀 功能特性

- **智能结构识别**：自动检测标题、列表、代码块等文档结构
- **多级标题支持**：支持 H1-H6 六级标题自动识别
- **列表识别**：支持有序列表和无序列表
- **代码块检测**：自动识别和格式化代码块
- **目录检测**：智能识别文档目录结构
- **实时预览**：转换过程中实时显示进度和结果
- **调试视图**：提供详细的转换过程调试信息
- **现代化 UI**：美观的用户界面，支持拖拽上传

## 📋 目录

- [安装和运行](#安装和运行)
- [项目架构](#项目架构)
- [工作原理](#工作原理)
- [转换流程](#转换流程)
- [转换规则](#转换规则)
- [技术栈](#技术栈)
- [开发指南](#开发指南)

## 🛠️ 安装和运行

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

访问 http://localhost:8080 查看应用

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 🏗️ 项目架构

```
src/
├── javascript/
│   ├── components/          # React 组件
│   │   ├── App.tsx         # 主应用组件
│   │   ├── UploadView.tsx  # 文件上传界面
│   │   ├── LoadingView.tsx # PDF 解析进度界面
│   │   ├── ResultView.tsx  # 转换结果展示
│   │   └── DebugView.tsx   # 调试信息界面
│   ├── models/             # 核心数据模型
│   │   ├── AppState.tsx    # 应用状态管理
│   │   ├── Page.tsx        # 页面数据模型
│   │   ├── TextItem.tsx    # 文本项模型
│   │   ├── LineItem.tsx    # 行项模型
│   │   └── transformations/ # 转换流水线
│   └── css/                # 样式文件
└── index.html              # 主页面
```

## 🔄 工作原理

### 1. PDF 解析阶段

使用 **PDF.js** 库解析 PDF 文件：

1. **文档解析**：提取 PDF 文档结构和元数据
2. **页面解析**：逐页提取文本内容和位置信息
3. **字体解析**：分析字体信息，用于文本样式识别
4. **文本提取**：获取每个文本块的位置、大小、字体等信息

### 2. 数据模型转换

将 PDF 原始数据转换为结构化数据模型：

```
PDF 原始数据 → TextItem → LineItem → LineItemBlock → Markdown
```

- **TextItem**：单个文本项，包含位置、大小、字体信息
- **LineItem**：文本行，由多个 TextItem 组成
- **LineItemBlock**：文本块，包含完整的段落或结构单元

### 3. 转换流水线

应用一系列转换规则，逐步识别和标记文档结构：

```
原始文本 → 文本清理 → 结构识别 → 格式转换 → Markdown 输出
```

## 🔄 转换流程

### 阶段 1：文本预处理

1. **CompactLines**：合并相邻的文本行
2. **RemoveRepetitiveElements**：移除重复的页面元素（如页眉页脚）
3. **VerticalToHorizontal**：将垂直排列的文本转换为水平排列

### 阶段 2：结构识别

1. **DetectTOC**：检测文档目录结构
2. **DetectHeaders**：识别标题层级（H1-H6）
3. **DetectListItems**：识别列表项（有序和无序）
4. **GatherBlocks**：将相关文本项聚合成块
5. **DetectCodeQuoteBlocks**：识别代码块和引用块
6. **DetectListLevels**：确定列表的嵌套层级

### 阶段 3：格式转换

1. **ToTextBlocks**：将 LineItem 转换为文本块
2. **ToMarkdown**：将文本块转换为 Markdown 格式

## 📝 转换规则

### 标题识别规则

#### 1. 基于字体大小的识别

```javascript
// 标题检测逻辑
if (height > mostUsedHeight && !isListItem(text)) {
    // 根据字体大小确定标题级别
    const headlineLevel = calculateLevel(height);
    item.type = headlineByLevel(headlineLevel);
}
```

**识别规则**：
- 字体大小大于正文字体
- 不是列表项
- 按字体大小降序排列，确定标题级别

#### 2. 基于目录的识别

如果检测到目录（TOC），使用目录中的标题高度作为参考：

```javascript
// 使用目录中的标题高度范围
headlineTypeToHeightRange[headlineType].max
```

### 列表识别规则

#### 1. 无序列表

**识别条件**：
- 以 `-`、`•`、`*` 等符号开头
- 自动标准化为 `-` 符号

```javascript
if (isListItemCharacter(item.words[0].string)) {
    item.type = BlockType.LIST;
    // 标准化为 '-'
    if (item.words[0].string !== '-') {
        item.words[0].string = '-';
    }
}
```

#### 2. 有序列表

**识别条件**：
- 以数字 + 点号开头（如 "1."、"2."）
- 支持多级嵌套

```javascript
if (isNumberedListItem(text)) {
    item.type = BlockType.LIST;
}
```

### 代码块识别规则

**识别条件**：
- 使用等宽字体（如 Courier、Monaco）
- 文本格式与正文明显不同
- 可能包含特殊字符或缩进

```javascript
// 代码块转换
def('CODE', {
    toText(block) {
        return '```\n' + linesToText(block.items, true) + '\n```';
    }
});
```

### 段落处理规则

**默认规则**：
- 未识别的文本块作为普通段落处理
- 保持原有的换行和空格
- 自动处理段落间的空行

```javascript
def('PARAGRAPH', {
    toText(block) {
        return linesToText(block.items, false);
    }
});
```

## 🎯 转换示例

### 输入 PDF 结构

```
标题：项目介绍
正文：这是一个示例项目...
- 功能1
- 功能2
1. 步骤1
2. 步骤2
```

### 输出 Markdown

```markdown
# 项目介绍

这是一个示例项目...

- 功能1
- 功能2

1. 步骤1
2. 步骤2
```

## 🛠️ 技术栈

### 前端框架
- **React 18**：用户界面框架
- **TypeScript**：类型安全的 JavaScript
- **React Bootstrap**：UI 组件库

### PDF 处理
- **PDF.js**：PDF 解析和渲染
- **Remarkable**：Markdown 解析器

### 构建工具
- **Webpack 5**：模块打包工具
- **Babel**：JavaScript 编译器
- **Jest**：测试框架

### 开发工具
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **React Testing Library**：组件测试

## 🧪 测试

### 运行所有测试

```bash
npm test
```

### 运行特定测试

```bash
npm test -- --testNamePattern="App"
```

### 测试覆盖率

```bash
npm run test:coverage
```

## 🔧 开发指南

### 添加新的转换规则

1. 在 `src/javascript/models/transformations/` 下创建新的转换类
2. 继承相应的基类（如 `ToLineItemTransformation`）
3. 实现 `transform` 方法
4. 在 `AppState.tsx` 中注册新的转换规则

### 示例：自定义转换规则

```javascript
import ToLineItemTransformation from '../ToLineItemTransformation';

export default class CustomTransformation extends ToLineItemTransformation {
    constructor() {
        super("Custom Transformation");
    }

    transform(parseResult) {
        // 实现转换逻辑
        parseResult.pages.forEach(page => {
            page.items.forEach(item => {
                // 自定义处理逻辑
            });
        });
        
        return parseResult;
    }
}
```

### 调试转换过程

1. 使用 Debug 视图查看转换过程
2. 查看控制台日志了解转换详情
3. 使用浏览器开发者工具检查数据流

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 联系方式
- 邮箱：[yhj2433488839@gmail.com]

---

**注意**：这是一个实验性项目，转换结果可能因 PDF 文件格式而异。建议在使用前测试您的具体文档。
