import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UploadView from '../UploadView';

describe('UploadView Component', () => {
  const mockOnDrop = jest.fn();

  beforeEach(() => mockOnDrop.mockClear());

  it('renders without crashing', () => {
    const { getByText } = render(
      <UploadView onDrop={mockOnDrop} />
    );
    
    expect(getByText('Drop your PDF file here!')).toBeInTheDocument();
  });

  it('calls onDrop when one file is selected', async () => {
    const { container } = render(
      <UploadView onDrop={mockOnDrop} />
    );

    const file = new File(['dummy content'], 'file.pdf', { type: 'application/pdf' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { files: [file] } } as any);

    await waitFor(() => expect(mockOnDrop).toHaveBeenCalledTimes(1));
  });
}); 