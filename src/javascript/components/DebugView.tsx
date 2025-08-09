import React, { useState, useCallback } from 'react';
import { ButtonToolbar, ButtonGroup, Button, Dropdown, Pagination, Form, Collapse, Card } from 'react-bootstrap';

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
  createPageView?: (page: any, modificationsOnly: boolean) => React.ReactElement;
  showModificationCheckbox?: () => boolean;
}

// 定义 ParseResult 接口
interface ParseResult {
  pages: any[];
  globals: Record<string, any>;
  messages: string[];
}

// 定义组件的 Props 类型
interface DebugViewProps {
  pages: PDFPage[];
  transformations: TransformationResult[];
}

const DebugView: React.FC<DebugViewProps> = ({ pages, transformations }) => {
  const [currentTransformation, setCurrentTransformation] = useState(0);
  const [pageNr, setPageNr] = useState(-1);
  const [modificationsOnly, setModificationsOnly] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const selectPage = useCallback((selectedPageNr: number) => {
    setPageNr(selectedPageNr - 1);
  }, []);

  const selectTransformation = useCallback((transformationIndex: number) => {
    setCurrentTransformation(transformationIndex);
  }, []);

  const nextTransformation = useCallback(() => {
    setCurrentTransformation(prev => prev + 1);
  }, []);

  const prevTransformation = useCallback(() => {
    setCurrentTransformation(prev => prev - 1);
  }, []);

  const toggleModifications = useCallback(() => {
    setModificationsOnly(prev => !prev);
  }, []);

  const toggleStatistics = useCallback(() => {
    setShowStatistics(prev => !prev);
  }, []);

  // 模拟原来的转换逻辑
  const parseResult: ParseResult = React.useMemo(() => {
    const clonedPages = JSON.parse(JSON.stringify(pages || []));
    let result: ParseResult = { 
      pages: clonedPages, 
      globals: {}, 
      messages: [] 
    };
    let lastTransformation: TransformationResult | null = null;

    for (let i = 0; i <= currentTransformation && i < transformations.length; i++) {
      if (lastTransformation) {
        result = lastTransformation.completeTransform?.(result) || result;
      }
      result = transformations[i].transform(result);
      lastTransformation = transformations[i];
    }

    result.pages = result.pages.filter((_, i) => pageNr === -1 || i === pageNr);
    return result;
  }, [pages, transformations, currentTransformation, pageNr]);

  const currentTransformationName = transformations[currentTransformation]?.name || '';
  const lastTransformation = transformations[currentTransformation];

  const pageComponents = parseResult.pages.map(page => 
    lastTransformation?.createPageView?.(page, modificationsOnly) || <div key={page.pageNumber}>Page {page.pageNumber}</div>
  );

  const showModificationCheckbox = lastTransformation?.showModificationCheckbox?.() || false;

  const statisticsAsList = Object.entries(parseResult.globals).map(([key, value], i) => (
    <li key={i}>
      {`${key}: ${JSON.stringify(value)}`}
    </li>
  ));

  const messagesAsList = parseResult.messages.map((message, i) => (
    <li key={i}>
      {message}
    </li>
  ));

  const transformationMenuItems = transformations.map((transformation, index) => (
    <Dropdown.Item 
      key={index} 
      eventKey={index}
      onSelect={() => selectTransformation(index)}
    >
      {transformation.name}
    </Dropdown.Item>
  ));

  const pageCount = pages.length;
  const active = pageNr + 1; // 1-based

  const pagination = (
    <Pagination>
      <Pagination.First onClick={() => selectPage(1)} disabled={active <= 1} />
      <Pagination.Prev onClick={() => selectPage(Math.max(1, active - 1))} disabled={active <= 1} />
      {(() => {
        const windowSize = 17;
        let start = Math.max(1, active - Math.floor(windowSize / 2));
        let end = Math.min(pageCount, start + windowSize - 1);
        start = Math.max(1, end - windowSize + 1);

        const items: React.ReactNode[] = [];
        if (start > 1) {
          const prevWindowTarget = Math.max(1, start - windowSize);
          items.push(
            <Pagination.Item key="start-ellipsis" onClick={() => selectPage(prevWindowTarget)}>
              …
            </Pagination.Item>
          );
        }
        for (let page = start; page <= end; page++) {
          items.push(
            <Pagination.Item key={page} active={page === active} onClick={() => selectPage(page)}>
              {page}
            </Pagination.Item>
          );
        }
        if (end < pageCount) {
          const nextWindowTarget = Math.min(pageCount, end + 1);
          items.push(
            <Pagination.Item key="end-ellipsis" onClick={() => selectPage(nextWindowTarget)}>
              …
            </Pagination.Item>
          );
        }
        return items;
      })()}
      <Pagination.Next onClick={() => selectPage(Math.min(pageCount, active + 1))} disabled={active >= pageCount} />
      <Pagination.Last onClick={() => selectPage(pageCount)} disabled={active >= pageCount} />
    </Pagination>
  );

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <div>
                <ul className='pagination'>
                  <li className={pageNr === -1 ? 'active' : ''}>
                    <a role='button' onClick={() => selectPage(0)}>ALL</a>
                  </li>
                </ul>
                {pagination}
              </div>
            </td>
            <td style={{ padding: '5px', textAlign: 'left' }}>
              <Form.Label>
                Pages
              </Form.Label>
            </td>
          </tr>
          <tr>
            <td>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button 
                    className={currentTransformation > 0 ? 'btn-round' : 'btn-round disabled'} 
                    onClick={prevTransformation}
                  >
                    ← Previous
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  {' '}
                  <Button 
                    className={currentTransformation < transformations.length - 1 ? 'btn-round' : 'btn-round disabled'} 
                    onClick={nextTransformation}
                  >
                    Next →
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-size-medium">
                      {currentTransformationName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {transformationMenuItems}
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>
                <ButtonGroup>
                  {showModificationCheckbox && (
                    <Form.Check type="checkbox" onClick={toggleModifications}>
                      Show only modifications
                    </Form.Check>
                  )}
                </ButtonGroup>
                <ButtonGroup>
                  <Form.Check type="checkbox" onClick={toggleStatistics}>
                    Show Statistics
                  </Form.Check>
                </ButtonGroup>
              </ButtonToolbar>
            </td>
            <td style={{ padding: '5px' }}>
              <Form.Label>
                Transformations
                {` - ${currentTransformation} / ${transformations.length - 1}`}
              </Form.Label>
            </td>
          </tr>
          <tr>
            <td>
              <Collapse in={showStatistics}>
                <Card>
                  <ul>
                    {statisticsAsList}
                  </ul>
                </Card>
              </Collapse>
            </td>
          </tr>
        </tbody>
      </table>
      {!showStatistics && <hr style={{ marginTop: '5px' }} />}
      <ul>
        {messagesAsList}
      </ul>
      {pageComponents}
    </div>
  );
};

export default DebugView; 