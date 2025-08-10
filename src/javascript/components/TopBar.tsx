import React from 'react';

import AppLogo from './AppLogo';
import { View } from '../models/AppState';

// 定义组件的 Props 类型
interface TopBarProps {
  mainView: View;
  switchMainViewFunction: (view: View) => void;
  title?: string;
  onHelp?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ mainView, switchMainViewFunction, title, onHelp }) => {
  const showTabs = mainView === View.RESULT || mainView === View.DEBUG;

  return (
    <div className="topbar">
      <div className="topbar-content">
      <div>
        <AppLogo bsRole="toggle" />
      </div>
      {showTabs && (
          <div className="topbar-tabs">
          <button 
            onClick={() => switchMainViewFunction(View.DEBUG)}
              className={`btn-tab ${mainView === View.DEBUG ? 'active' : ''}`}
          >
            Debug View
          </button>
          <button 
            onClick={() => switchMainViewFunction(View.RESULT)}
              className={`btn-tab ${mainView === View.RESULT ? 'active' : ''}`}
          >
            Result View
          </button>
        </div>
      )}
        <div className="topbar-actions">
          {onHelp && (
            <button className="btn-help" onClick={onHelp} title="帮助">
              <i className="fas fa-question"></i>
              <span>帮助</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar; 