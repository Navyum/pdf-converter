import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UploadView from '../UploadView';

describe('UploadView Component', () => {
  const mockUploadPdfFunction = jest.fn();

  beforeEach(() => mockUploadPdfFunction.mockClear());

  it('renders without crashing', () => {
    const { getByText } = render(
      <UploadView uploadPdfFunction={mockUploadPdfFunction} />
    );
    
    expect(getByText('Drop your PDF file here!')).toBeInTheDocument();
  });

  it('calls uploadPdfFunction when one file is selected', async () => {
    const { container } = render(
      <UploadView uploadPdfFunction={mockUploadPdfFunction} />
    );

    const file = new File(['dummy content'], 'file.pdf', { type: 'application/pdf' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { files: [file] } } as any);

    await waitFor(() => expect(mockUploadPdfFunction).toHaveBeenCalledTimes(1));
  });
}); 