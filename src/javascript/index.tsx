import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/styles.css';

import AppState from './models/AppState';
import App from './components/App';
import { View } from './models/AppState';

// PDF.js 配置
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'bundle.worker.js';

// 创建 root 实例（只创建一次）
const rootElement = document.getElementById('main');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

// 渲染函数
function render(appState: AppState) {
  root.render(
    <App appState={appState as any} />
  );
}

// 创建应用状态
const appState = new AppState({ renderFunction: render });

// 初始渲染
appState.render(); 