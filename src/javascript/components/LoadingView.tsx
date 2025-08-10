import React, { Component } from 'react';
import * as pdfjs from 'pdfjs-dist';
import TextItem from '../models/TextItem';
import Page from '../models/Page';
import Metadata from '../models/Metadata';
// import Word from '../models/Word';
// import WordFormatModule from '../models/markdown/WordFormat';
// import WordType from '../models/markdown/WordType';

pdfjs.GlobalWorkerOptions.workerSrc = 'bundle.worker.js';

interface LoadingViewProps {
  fileBuffer: Uint8Array | null;
  storePdfPagesFunction: (payload: { pages: any[]; metadata?: any; fontMap?: any }) => void;
}

interface LoadingViewState {
  document: any;
  metadata: any;
  pages: any[];
  fontIds: Set<string>;
  fontMap: Map<string, any>;
  progress: Progress;
}

// Progress tracking classes
class ProgressStage {
  name: string;
  steps: number;
  stepsDone: number;

  constructor(name: string, steps: number = 0) {
    this.name = name;
    this.steps = steps;
    this.stepsDone = 0;
  }

  isComplete(): boolean {
    return this.stepsDone === this.steps;
  }

  percentDone(): number {
    if (typeof this.steps === 'undefined') {
      return 0;
    }
    if (this.steps === 0) {
      return 100;
    }
    return (this.stepsDone / this.steps) * 100;
  }
}

class Progress {
  stages: ProgressStage[];
  currentStage: number;

  constructor(options: { stages: ProgressStage[] }) {
    this.stages = options.stages;
    this.currentStage = 0;
  }

  completeStage(): void {
    this.currentStage++;
  }

  isComplete(): boolean {
    return this.currentStage === this.stages.length;
  }

  activeStage(): ProgressStage {
    return this.stages[this.currentStage];
  }

  metadataStage(): ProgressStage {
    return this.stages[0];
  }

  pageStage(): ProgressStage {
    return this.stages[1];
  }

  fontStage(): ProgressStage {
    return this.stages[2];
  }
}

class LoadingView extends Component<LoadingViewProps, LoadingViewState> {
  constructor(props: LoadingViewProps) {
    super(props);

    const progress = new Progress({
      stages: [
        new ProgressStage('Parsing Metadata', 2),
        new ProgressStage('Parsing Pages'),
        new ProgressStage('Parsing Fonts', 0)
      ]
    });

    this.state = {
      document: null,
      metadata: null,
      pages: [],
      fontIds: new Set(),
      fontMap: new Map(),
      progress: progress,
    };
  }

  documentParsed(document: any): void {
    const metadataStage = this.state.progress.metadataStage();
    const pageStage = this.state.progress.pageStage();
    metadataStage.stepsDone++;

    const numPages = document.numPages;
    pageStage.steps = numPages;

    const pages = [];
    for (let i = 0; i < numPages; i++) {
      pages.push(new Page({
        index: i
      }));
    }

    this.setState({
      document: document,
      pages: pages,
    });
  }

  metadataParsed(metadata: any): void {
    const metadataStage = this.state.progress.metadataStage();
    metadataStage.stepsDone++;
    this.setState({
      metadata: new Metadata(metadata),
    });
  }

  pageParsed(index: number, textItems: any[]): void {
    const pageStage = this.state.progress.pageStage();
    pageStage.stepsDone = pageStage.stepsDone + 1;
    
    const updatedPages = [...this.state.pages];
    updatedPages[index].items = textItems;
    
    this.setState({
      pages: updatedPages,
      progress: this.state.progress
    });
    
    // 如果所有页面都解析完成，检查字体解析是否需要强制完成
    if (pageStage.stepsDone >= pageStage.steps) {
      console.log('[LoadingView] 页面阶段完成，检查字体解析状态');
      setTimeout(() => {
        const fontStage = this.state.progress.fontStage();
        if (this.state.progress.activeStage() === fontStage && fontStage.stepsDone > 0) {
          console.log('All pages parsed, completing font stage');
          this.forceCompleteFontStage();
        }
        
        // 检查是否所有阶段都完成
        const percentDone = this.getPercentDone(this.state.progress);
        if (percentDone === 100) {
          console.log('[LoadingView] 所有阶段完成，调用 storePdfPagesFunction');
          console.log(this.state.pages);
          console.log(this.state.metadata);
          console.log(this.state.fontMap);
          this.props.storePdfPagesFunction({ 
            pages: this.state.pages, 
            metadata: this.state.metadata, 
            fontMap: this.state.fontMap 
          });
        }
      }, 2000); // 等待2秒让字体解析有机会完成
    }
  }

  fontParsed(fontId: string, font: any): void {
    const fontStage = this.state.progress.fontStage();
    const updatedFontMap = new Map(this.state.fontMap);
    updatedFontMap.set(fontId, font);
    fontStage.stepsDone++;
    
    // 确保字体解析进度不超过总步骤数
    if (fontStage.stepsDone > fontStage.steps) {
      fontStage.steps = fontStage.stepsDone;
    }
    
    if (this.state.progress.activeStage() === fontStage) {
      this.setState({
        fontMap: updatedFontMap,
      });
    }
    
    // 检查字体阶段是否完成，如果完成则检查是否所有阶段都完成
    if (fontStage.stepsDone >= fontStage.steps) {
      console.log('[LoadingView] 字体阶段完成，检查是否所有阶段都完成');
      // 强制完成字体阶段
      fontStage.stepsDone = fontStage.steps;
      
      // 检查是否所有阶段都完成
      const percentDone = this.getPercentDone(this.state.progress);
      if (percentDone === 100) {
        console.log('[LoadingView] 所有阶段完成，调用 storePdfPagesFunction');
        this.props.storePdfPagesFunction({ 
          pages: this.state.pages, 
          metadata: this.state.metadata, 
          fontMap: updatedFontMap 
        });
      }
    }
  }

  componentDidMount(): void {
    if (!this.props.fileBuffer) return;

    const fontStage = this.state.progress.fontStage();
    
    // 设置字体解析超时，防止无限等待
    const _fontTimeout = setTimeout(() => {
      if (this.state.progress.activeStage() === fontStage && fontStage.stepsDone > 0) {
        console.log('Font parsing timeout, proceeding with available fonts');
        this.forceCompleteFontStage();
      }
    }, 10000); // 10秒超时

    pdfjs.getDocument({
      data: this.props.fileBuffer,
      cMapUrl: 'cmaps/',
      cMapPacked: true
    }).promise.then((pdfDocument: any) => {
      pdfDocument.getMetadata().then((metadata: any) => {
        this.metadataParsed(metadata);
      });
      
      this.documentParsed(pdfDocument);
      
      for (let j = 1; j <= pdfDocument.numPages; j++) {
        pdfDocument.getPage(j).then((page: any) => {
          const scale = 1.0;
          const viewport = page.getViewport({ scale: scale });

          // 提取文本内容
          page.getTextContent().then((textContent: any) => {
            const textItems = textContent.items.map((item: any) => {
              // Trigger resolving of fonts
              const fontId = item.fontName;
              if (!this.state.fontIds.has(fontId) && fontId.startsWith('g_d0')) {
                this.state.document._transport.commonObjs.get(fontId, (font: any) => {
                  this.fontParsed(fontId, font);
                });
                const updatedFontIds = new Set(this.state.fontIds);
                updatedFontIds.add(fontId);
                this.setState({ fontIds: updatedFontIds });
                // 更新字体阶段的总步骤数
                fontStage.steps = Math.max(fontStage.steps, updatedFontIds.size);
              }

              const tx = pdfjs.Util.transform(
                viewport.transform,
                item.transform
              );

              const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
              const dividedHeight = item.height / fontHeight;
              
              return new TextItem({
                x: Math.round(item.transform[4]),
                y: Math.round(item.transform[5]),
                width: Math.round(item.width),
                height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
                text: item.str,
                font: item.fontName
              });
            });

            this.pageParsed(page._pageIndex, textItems);
          });
          
          page.getOperatorList().then(() => {
            // Do nothing... this is only for triggering the font retrieval
          }).catch((error: any) => {
            console.warn('Error getting operator list:', error);
          });
        });
      }
    });
  }

  componentDidUpdate(prevProps: LoadingViewProps, prevState: LoadingViewState): void {
    const { pages, fontMap, metadata, progress } = this.state;
    const percentDone = this.getPercentDone(progress);
    
    console.log('[LoadingView] componentDidUpdate - percentDone:', percentDone, 'progress.isComplete():', progress.isComplete());
    
    // 检查是否刚刚完成（从非100%变为100%）
    const prevPercentDone = this.getPercentDone(prevState.progress);
    if (prevPercentDone < 100 && percentDone === 100) {
      console.log('[LoadingView] 所有阶段完成，调用 storePdfPagesFunction');
      this.props.storePdfPagesFunction({ pages, metadata, fontMap });
    }
  }

  render(): React.ReactElement {
    const { progress } = this.state;
    const percentDone = this.getPercentDone(progress);
    
    const stageItems = progress.stages
      .filter((elem, i) => i <= progress.currentStage)
      .map((stage, i) => {
        const progressDetails = stage.steps ? `${stage.stepsDone} / ${stage.steps}` : '';
        const checkmark = stage.isComplete() ? (
          <i className="fas fa-check" style={{ color: 'green' }}></i>
        ) : '';
        
        return (
          <div key={i}>
            {stage.name}
            {' ' + progressDetails + ' '}
            {checkmark}
          </div>
        );
      });

    return (
      <div className="loading-view">
        <div className="loading-content">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h3>正在处理 PDF 文件...</h3>
          <p>请稍候，我们正在解析和转换您的文档</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${percentDone}%`,
                  backgroundColor: '#007bff',
                  height: '4px',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div className="progress-stages">
              {stageItems}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private forceCompleteFontStage(): void {
    const fontStage = this.state.progress.fontStage();
    fontStage.stepsDone = fontStage.steps;
    this.setState({ progress: this.state.progress });
    
    // 检查是否所有阶段都完成
    const percentDone = this.getPercentDone(this.state.progress);
    if (percentDone === 100) {
      console.log('[LoadingView] 强制完成字体阶段后，所有阶段完成，调用 storePdfPagesFunction');
      this.props.storePdfPagesFunction({ 
        pages: this.state.pages, 
        metadata: this.state.metadata, 
        fontMap: this.state.fontMap 
      });
    }
  }

  private getPercentDone(progress: Progress): number {
    // 如果所有阶段都完成，返回100%
    if (progress.isComplete()) {
      return 100;
    }

    const activeStage = progress.activeStage();
    // 安全检查：确保 activeStage 存在
    if (!activeStage) {
      return 0;
    }

    const percentDone = activeStage.percentDone();

    if (percentDone === 100) {
      progress.completeStage();
      if (!progress.isComplete()) {
        return this.getPercentDone(progress);
      }
    }

    return percentDone;
  }
}

export default LoadingView; 