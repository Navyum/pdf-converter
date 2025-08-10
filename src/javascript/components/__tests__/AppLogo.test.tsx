import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AppLogo from '../AppLogo';

describe('AppLogo Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<AppLogo />);
    
    expect(getByText(/PDF To Markdown/)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    const { getByText } = render(<AppLogo onClick={mockOnClick} />);
    
    const logoLink = getByText(/PDF To Markdown/);
    fireEvent.click(logoLink);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('supports bsRole prop for react-bootstrap compatibility', () => {
    const { container } = render(<AppLogo bsRole="toggle" />);
    
    const logoLink = container.querySelector('a[role="toggle"]');
    expect(logoLink).toBeInTheDocument();
  });
}); 