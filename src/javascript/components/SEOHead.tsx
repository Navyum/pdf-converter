import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'PDF转Markdown工具 - 免费在线PDF文档转换器',
  description = '免费在线PDF转Markdown工具，支持中文文档转换，保持格式完整，快速高效。无需注册，即用即走，保护隐私安全。',
  keywords = 'PDF转Markdown,PDF转换器,在线转换,文档转换,Markdown编辑器,中文PDF,免费工具',
  ogImage = 'https://pdf-converter.camscanner.top/assets/og-image.png',
  canonical = 'https://pdf-converter.camscanner.top/'
}) => {
  React.useEffect(() => {
    // 动态更新页面标题
    document.title = title;
    
    // 更新 meta 描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // 更新 meta 关键词
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // 更新 canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    }
    
    // 更新 Open Graph 标签
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }
  }, [title, description, keywords, ogImage, canonical]);

  return null; // 这个组件不渲染任何内容
};

export default SEOHead; 