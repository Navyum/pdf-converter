import React from 'react';

import AppLogo from './AppLogo';
import { View } from '../models/AppState';

// 定义组件的 Props 类型
interface TopBarProps {
  mainView: View;
  switchMainViewFunction: (view: View) => void;
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ mainView, switchMainViewFunction, title }) => {
  const showTabs = mainView === View.RESULT || mainView === View.DEBUG;

  return (
    <div style={{ 
      backgroundColor: '#333', 
      color: 'white', 
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <AppLogo bsRole="toggle" />
      </div>
      {showTabs && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => switchMainViewFunction(View.DEBUG)}
            style={{ 
              padding: '5px 10px', 
              backgroundColor: mainView === View.DEBUG ? '#007bff' : 'transparent',
              border: '1px solid #007bff',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Debug View
          </button>
          <button 
            onClick={() => switchMainViewFunction(View.RESULT)}
            style={{ 
              padding: '5px 10px', 
              backgroundColor: mainView === View.RESULT ? '#007bff' : 'transparent',
              border: '1px solid #007bff',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Result View
          </button>
        </div>
      )}
      <div>
        {title}
      </div>
    </div>
  );
};

export default TopBar; 