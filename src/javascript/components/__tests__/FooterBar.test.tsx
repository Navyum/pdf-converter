import React from 'react';
import { render } from '@testing-library/react';
import FooterBar from '../FooterBar';

describe('FooterBar Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<FooterBar />);
    
    expect(getByText(/PDF to Markdown/i)).toBeInTheDocument();
  });

  it('displays static footer text', () => {
    const { getByText } = render(<FooterBar />);
    
    expect(getByText(/Convert your PDF files to Markdown format/i)).toBeInTheDocument();
  });
}); 