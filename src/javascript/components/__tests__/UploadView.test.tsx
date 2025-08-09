import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UploadView from '../UploadView';

describe('UploadView Component', () => {
  const mockUploadPdfFunction = jest.fn();

  it('renders without crashing', () => {
    const { getByText } = render(
      <UploadView uploadPdfFunction={mockUploadPdfFunction} />
    );
    
    expect(getByText('Drop your PDF file here!')).toBeInTheDocument();
  });

  it('shows error when multiple files are dropped', () => {
    const { getByText } = render(
      <UploadView uploadPdfFunction={mockUploadPdfFunction} />
    );

    const files = [
      new File(['dummy content'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['another dummy content'], 'file2.pdf', { type: 'application/pdf' })
    ];

    // 模拟文件拖放
    fireEvent.drop(getByText('Drop your PDF file here!'), {
      dataTransfer: { files }
    });

    expect(getByText(/Maximum one file allowed to upload/i)).toBeInTheDocument();
    expect(mockUploadPdfFunction).not.toHaveBeenCalled();
  });
}); 