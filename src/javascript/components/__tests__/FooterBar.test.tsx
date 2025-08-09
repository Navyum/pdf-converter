import React from 'react';
import { render } from '@testing-library/react';
import FooterBar from '../FooterBar';

describe('FooterBar Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<FooterBar />);
    
    expect(getByText(/offline tool/i)).toBeInTheDocument();
  });

  it('displays feedback link with correct attributes', () => {
    const { getByText } = render(<FooterBar />);
    
    const feedbackLink = getByText('Feedback & Bug Reports');
    expect(feedbackLink).toHaveAttribute('href', 'https://github.com/jzillmann/pdf-to-markdown/issues');
    expect(feedbackLink).toHaveAttribute('target', '_blank');
    expect(feedbackLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 