import React from 'react';

// 定义组件的 Props 类型
interface AppLogoProps {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  bsRole?: string; // 用于 react-bootstrap 的兼容性
}

const AppLogo: React.FC<AppLogoProps> = ({ onClick, bsRole }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);
  };

  return (
    <a href="" onClick={handleClick} role={bsRole}>
      📄 PDF To Markdown Converter
    </a>
  );
};

export default AppLogo; 