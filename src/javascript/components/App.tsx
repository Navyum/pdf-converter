import React from 'react';
import TopBar from './TopBar';
import FooterBar from './FooterBar';
import UploadView from './UploadView';
import LoadingView from './LoadingView';
import ResultView from './ResultView';
import DebugView from './DebugView';
import { View } from '../models/AppState';
import AppState from '../models/AppState';

interface AppProps {
  appState: AppState;
}

const App: React.FC<AppProps> = ({ appState }) => {
  const { mainView, pdfPages, transformations, finalText, fileBuffer } = appState;

  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const fileBuffer = evt.target?.result;
      if (fileBuffer instanceof ArrayBuffer) {
        appState.storeFileBuffer(new Uint8Array(fileBuffer));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleHelp = () => {
    // 显示帮助信息
    alert('PDF to Markdown 帮助信息\n\n1. 拖拽或选择 PDF 文件进行转换\n2. 等待处理完成\n3. 查看转换结果\n4. 使用调试视图查看详细信息');
  };

  const getTitle = () => {
    switch (mainView) {
      case View.UPLOAD:
        return 'PDF to Markdown Converter';
      case View.LOADING:
        return 'Processing PDF...';
      case View.RESULT:
        return 'Conversion Result';
      case View.DEBUG:
        return 'Debug View';
      default:
        throw new Error(`View ${mainView} not supported!`);
    }
  };

  const getMainView = () => {
    switch (mainView) {
      case View.UPLOAD:
        return <UploadView onDrop={handleFileDrop} />;
      case View.LOADING:
        return (
          <LoadingView
            fileBuffer={fileBuffer}
            storePdfPagesFunction={appState.storePdfPages}
          />
        );
      case View.RESULT:
        return (
          <ResultView
            pages={pdfPages}
            transformations={transformations}
            precomputedText={finalText}
          />
        );
      case View.DEBUG:
        return (
          <DebugView
            pages={pdfPages}
            transformations={transformations}
          />
        );
      default:
        throw new Error(`View ${mainView} not supported!`);
    }
  };

  const isUpload = mainView === View.UPLOAD;

  return (
    <div className="app-container">
      <TopBar
        mainView={mainView}
        switchMainViewFunction={appState.switchMainView}
        title={getTitle()}
        onHelp={handleHelp}
      />
      <div className="page-container">
        {isUpload ? (
          getMainView()
        ) : (
          <div className="section-card">
            {getMainView()}
          </div>
        )}
      </div>
      <FooterBar />
    </div>
  );
};

export default App; 