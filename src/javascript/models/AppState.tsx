import CalculateGlobalStats from './transformations/textitem/CalculateGlobalStats.jsx';
import CompactLines from './transformations/lineitem/CompactLines.jsx';
import RemoveRepetitiveElements from './transformations/lineitem/RemoveRepetitiveElements.jsx';
import VerticalToHorizontal from './transformations/lineitem/VerticalToHorizontal.jsx';
import DetectTOC from './transformations/lineitem/DetectTOC.jsx';
import DetectListItems from './transformations/lineitem/DetectListItems.jsx';
import DetectHeaders from './transformations/lineitem/DetectHeaders.jsx';
import GatherBlocks from './transformations/textitemblock/GatherBlocks.jsx';
import DetectCodeQuoteBlocks from './transformations/textitemblock/DetectCodeQuoteBlocks.jsx';
import DetectListLevels from './transformations/textitemblock/DetectListLevels.jsx';
import ToTextBlocks from './transformations/ToTextBlocks.jsx';
import ToMarkdown from './transformations/ToMarkdown.jsx';

// 定义视图枚举
export enum View {
  UPLOAD = 'upload',
  RESULT = 'result',
  DEBUG = 'debug',
  LOADING = 'loading'
}

// 定义 AppState 接口
export interface AppStateType {
  mainView: View;
  fileBuffer: Uint8Array | null;
  pdfPages: any[];
  metadata?: any;
  transformations?: any[];
  storeFileBuffer: (fileBuffer: Uint8Array) => void;
  storePdfPages: (payload: { pages: any[]; metadata?: any; fontMap?: any }) => void;
  switchMainView: (view: View) => void;
  render: () => void;
  // 新增：预计算的最终文本
  finalText?: string;
}

// 定义 AppState 类
class AppState implements AppStateType {
  private renderFunction: (appState: AppState) => void;
  private _mainView: View;
  private _fileBuffer: Uint8Array | null = null;
  private _pdfPages: any[] = [];
  private _metadata: any | null = null;
  private _transformations: any[] = [];
  private _finalText: string = '';

  constructor(options: { renderFunction: (appState: AppState) => void }) {
    this.renderFunction = options.renderFunction;
    this._mainView = View.UPLOAD;
  }

  get mainView(): View {
    return this._mainView;
  }

  get fileBuffer(): Uint8Array | null {
    return this._fileBuffer;
  }

  get pdfPages(): any[] {
    return this._pdfPages;
  }

  get metadata(): any | null {
    return this._metadata;
  }

  get transformations(): any[] {
    return this._transformations;
  }

  get finalText(): string {
    return this._finalText;
  }

  storeFileBuffer = (fileBuffer: Uint8Array): void => {
    console.log('[AppState] storeFileBuffer, size:', fileBuffer?.byteLength);
    this._fileBuffer = fileBuffer;
    this.switchMainView(View.LOADING);
  };

  storePdfPages = (payload: { pages: any[]; metadata?: any; fontMap?: any }): void => {
    const { pages, metadata, fontMap } = payload || ({} as any);
    console.log('[AppState] storePdfPages, pages:', pages?.length);
    this._pdfPages = pages || [];
    if (typeof metadata !== 'undefined') this._metadata = metadata;

    // 构建转换流水线（与旧版保持一致）
    try {
      const transformations: any[] = [];
      if (fontMap) {
        transformations.push(new CalculateGlobalStats(fontMap));
      }
      transformations.push(
        new CompactLines(),
        new RemoveRepetitiveElements(),
        new VerticalToHorizontal(),
        new DetectTOC(),
        new DetectHeaders(),
        new DetectListItems(),
        new GatherBlocks(),
        new DetectCodeQuoteBlocks(),
        new DetectListLevels(),
        new ToTextBlocks(),
        new ToMarkdown()
      );
      this._transformations = transformations;

      // 预先执行完整转换链，得到最终文本，避免视图层重复执行与副作用
      try {
        const clonedPages = JSON.parse(JSON.stringify(this._pdfPages));
        let result: any = { pages: clonedPages, globals: {}, messages: [] };
        let last: any = null;
        console.log('[AppState] precompute start: pages=', result.pages.length, 'items[0]=', result.pages[0]?.items?.length);
        this._transformations.forEach((t, idx) => {
          if (last && typeof last.completeTransform === 'function') {
            result = last.completeTransform(result) || result;
          }
          if (t && typeof t.transform === 'function') {
            result = t.transform(result) || result;
          }
          const firstLen = result.pages?.[0]?.items?.length;
          const totalItems = Array.isArray(result.pages) ? result.pages.reduce((s: number, p: any) => s + (Array.isArray(p.items) ? p.items.length : 0), 0) : 0;
          console.log(`[AppState] after T${idx} ${t?.name}: firstPageItems=${firstLen} totalItems=${totalItems}`);
          last = t;
        });
        if (last && typeof last.completeTransform === 'function') {
          result = last.completeTransform(result) || result;
        }
        const combinedText = (result.pages || []).flatMap((p: any) => p.items || []).join('\n');
        this._finalText = combinedText || '';
        console.log('[AppState] precompute done, textLength=', this._finalText.length);
      } catch (e) {
        console.warn('[AppState] precompute final text failed:', e);
        this._finalText = '';
      }
    } catch (e) {
      console.warn('[AppState] build transformations failed:', e);
      this._transformations = [];
      this._finalText = '';
    }

    this._fileBuffer = null;
    this.switchMainView(View.RESULT);
  };

  switchMainView = (view: View): void => {
    console.log('[AppState] switchMainView ->', view);
    this._mainView = view;
    this.render();
  };

  render = (): void => {
    this.renderFunction(this);
  };
}

export default AppState; 