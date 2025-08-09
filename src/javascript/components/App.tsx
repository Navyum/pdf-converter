import React from 'react';

import TopBar from './TopBar';
import FooterBar from './FooterBar';
import { View } from '../models/AppState';
import UploadView from './UploadView';
import LoadingView from './LoadingView';
import ResultView from './ResultView';
import DebugView from './DebugView';

// 定义组件的 Props 类型
interface AppProps {
  appState: any;
}

const App: React.FC<AppProps> = ({ appState }) => {
  let mainView: React.ReactNode;

  switch (appState.mainView) {
    case View.UPLOAD:
      mainView = <UploadView uploadPdfFunction={(buffer: Uint8Array) => appState.storeFileBuffer(buffer)} />;
      break;
    case View.LOADING:
      mainView = (
        <LoadingView 
          fileBuffer={appState.fileBuffer} 
          storePdfPagesFunction={(payload: any) => appState.storePdfPages(payload)} 
        />
      );
      break;
    case View.RESULT:
      mainView = (
        <ResultView 
          pages={appState.pdfPages || appState.pages || []} 
          transformations={appState.transformations || []} 
          precomputedText={appState.finalText || ''}
        />
      );
      break;
    case View.DEBUG:
      mainView = (
        <DebugView 
          pages={appState.pdfPages || []} 
          transformations={appState.transformations || []} 
        />
      );
      break;
    default:
      throw new Error(`View ${appState.mainView} not supported!`);
  }

  const title = appState.metadata && appState.metadata.title ? appState.metadata.title : '';

  return (
    <div>
      <TopBar 
        mainView={appState.mainView} 
        switchMainViewFunction={(view: View) => appState.switchMainView(view)} 
        title={title} 
      />
      <div style={{ padding: '20px' }}>
        {mainView}
      </div>
      <FooterBar />
    </div>
  );
};

export default App; 