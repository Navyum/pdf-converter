import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TopBar from '../TopBar';
import { View } from '../../models/AppState';

describe('TopBar Component', () => {
  const mockSwitchMainViewFunction = jest.fn();

  beforeEach(() => {
    mockSwitchMainViewFunction.mockClear();
  });

  it('renders without crashing', () => {
    const { getByText } = render(
      <TopBar 
        mainView={View.UPLOAD} 
        switchMainViewFunction={mockSwitchMainViewFunction} 
        title="Test Title" 
      />
    );
    
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('shows debug and result tabs when appropriate', () => {
    const { getByText, queryByText } = render(
      <TopBar 
        mainView={View.RESULT} 
        switchMainViewFunction={mockSwitchMainViewFunction} 
        title="Test Title" 
      />
    );
    
    expect(getByText('Debug View')).toBeInTheDocument();
    expect(getByText('Result View')).toBeInTheDocument();
  });

  it('does not show tabs when in upload view', () => {
    const { queryByText } = render(
      <TopBar 
        mainView={View.UPLOAD} 
        switchMainViewFunction={mockSwitchMainViewFunction} 
        title="Test Title" 
      />
    );
    
    expect(queryByText('Debug View')).not.toBeInTheDocument();
    expect(queryByText('Result View')).not.toBeInTheDocument();
  });

  it('calls switchMainViewFunction when tab is clicked', () => {
    const { getByText } = render(
      <TopBar 
        mainView={View.RESULT} 
        switchMainViewFunction={mockSwitchMainViewFunction} 
        title="Test Title" 
      />
    );
    
    const debugTab = getByText('Debug View');
    fireEvent.click(debugTab);
    
    expect(mockSwitchMainViewFunction).toHaveBeenCalledWith(View.DEBUG);
  });
}); 