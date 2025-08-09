import React, { useState, useEffect, useCallback } from 'react';
import { Remarkable } from 'remarkable';

// 定义内联类型
interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  text?: string;
  items?: string[];
}

interface TransformationResult {
  type: string;
  name: string;
  description: string;
  applied: boolean;
  itemType?: string;
  transform: (parseResult: any) => any;
  completeTransform?: (parseResult: any) => any;
}

// 定义组件的 Props 类型
interface ResultViewProps {
  pages: PDFPage[];
  transformations: TransformationResult[];
  precomputedText?: string;
}

// 定义 ParseResult 接口
interface ParseResult {
  pages: {
    items: string[];
  }[];
}

const ResultView: React.FC<ResultViewProps> = ({ pages, transformations, precomputedText }) => {
  console.log('[ResultView] props.pages length:', pages?.length, 'transformations:', transformations?.length);
  const [preview, setPreview] = useState(true);
  const [text, setText] = useState(precomputedText || '');

  const safePages = Array.isArray(pages) ? pages : [];
  const safeTransformations = Array.isArray(transformations) ? transformations : [];

  useEffect(() => {
    if (precomputedText && precomputedText.length > 200) {
      // 已有较完整的预计算文本，直接使用
      setText(precomputedText);
      console.log('[ResultView] use precomputedText length:', precomputedText.length);
      return;
    }
    if (precomputedText && precomputedText.length > 0) {
      console.warn('[ResultView] precomputedText too short, fallback to local transform. length=', precomputedText.length);
    }

    console.log('[ResultView] useEffect start');
    try {
      const clonedPages = JSON.parse(JSON.stringify(safePages));
      let parseResult: any = { pages: clonedPages, globals: {}, messages: [] };
      console.log('[ResultView] initial parseResult pages:', parseResult.pages.length, 'first page items:', parseResult.pages[0]?.items?.length);

      let lastTransformation: any = null;
      safeTransformations.forEach((transformation, idx) => {
        console.log('[ResultView] applying transform', idx, transformation?.name || transformation?.type);
        if (lastTransformation && typeof lastTransformation.completeTransform === 'function') {
          parseResult = lastTransformation.completeTransform(parseResult) || parseResult;
        }
        if (transformation && typeof transformation.transform === 'function') {
          parseResult = transformation.transform(parseResult) || parseResult;
        }
        lastTransformation = transformation;
      });

      if (lastTransformation && typeof lastTransformation.completeTransform === 'function') {
        parseResult = lastTransformation.completeTransform(parseResult) || parseResult;
      }

      const generatedText = (parseResult.pages || [])
        .flatMap((page: any) => page.items || [])
        .join('\n');

      console.log('[ResultView] generated text length:', generatedText.length);
      setText(generatedText);
    } catch (e) {
      console.error('[ResultView] error during transformation:', e);
      setText('');
    }
  }, [safePages, safeTransformations, precomputedText]);

  const switchToPreview = useCallback(() => {
    setPreview(true);
  }, []);

  const switchToEdit = useCallback(() => {
    setPreview(false);
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }, []);

  const remarkable = new Remarkable({
    breaks: true,
    html: true
  });

  const textComponent = preview 
    ? <div dangerouslySetInnerHTML={{ __html: remarkable.render(text) }} /> 
    : (
      <textarea
        rows={45}
        cols={150}
        value={text}
        onChange={handleChange}
      />
    );

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={switchToEdit} 
          style={{ 
            padding: '5px 10px', 
            marginRight: '5px',
            backgroundColor: !preview ? '#007bff' : 'transparent',
            border: '1px solid #007bff',
            color: !preview ? 'white' : '#007bff',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button 
          onClick={switchToPreview} 
          style={{ 
            padding: '5px 10px',
            backgroundColor: preview ? '#007bff' : 'transparent',
            border: '1px solid #007bff',
            color: preview ? 'white' : '#007bff',
            cursor: 'pointer'
          }}
        >
          Preview
        </button>
      </div>
      <hr/>
      {textComponent}
    </div>
  );
};

export default ResultView; 