import React from 'react';

const FooterBar: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      width: '100%', 
      backgroundColor: '#f5f5f5', 
      borderTop: '1px solid #ddd',
      padding: '10px',
      textAlign: 'center'
    }}>
      <p style={{ margin: 0 }}>
        PDF to Markdown Converter - Convert your PDF files to Markdown format
      </p>
    </div>
  );
};

export default FooterBar; 