import React from 'react';
import PropTypes from 'prop-types';

import * as pdfjs from 'pdfjs-dist/build/pdf'; // eslint-disable-line no-unused-vars
pdfjs.GlobalWorkerOptions && (pdfjs.GlobalWorkerOptions.workerSrc = 'bundle.worker.js');

import Page from '../models/Page.jsx';
import TextItem from '../models/TextItem.jsx';
import Metadata from '../models/Metadata.jsx';

export default class LoadingView extends React.Component {

    static propTypes = {
        fileBuffer: PropTypes.object.isRequired,
        storePdfPagesFunction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        const progress = new Progress({
            stages: [
                new ProgressStage('Parsing Metadata', 2),
                new ProgressStage('Parsing Pages'),
                new ProgressStage('Parsing Fonts', 0)
            ]
        });
        Progress.prototype.metadataStage = () => {
            return progress.stages[0]
        };
        Progress.prototype.pageStage = () => {
            return progress.stages[1]
        };
        Progress.prototype.fontStage = () => {
            return progress.stages[2]
        };
        this.state = {
            document: null,
            metadata: null,
            pages: [],
            fontIds: new Set(),
            fontMap: new Map(),
            parsedPages: new Set(),
            progress: progress,
        };
        // one-time dispatch guard
        this._didDispatchComplete = false;
        this._didStartParse = false;
    }

    documentParsed(document) {
        const metadataStage = this.state.progress.metadataStage();
        const pageStage = this.state.progress.pageStage();
        metadataStage.stepsDone = Math.min(metadataStage.stepsDone + 1, metadataStage.steps);

        const numPages = document.numPages;
        pageStage.steps = numPages;
        pageStage.stepsDone = 0;

        var pages = [];
        for (var i = 0; i < numPages; i++) {
            pages.push(new Page({
                index: i
            }));
        }

        this.setState({
            document: document,
            pages: pages,
        });
    }

    metadataParsed(metadata) {
        const metadataStage = this.state.progress.metadataStage();
        metadataStage.stepsDone = Math.min(metadataStage.stepsDone + 1, metadataStage.steps);
        // console.debug(new Metadata(metadata));
        this.setState({
            metadata: new Metadata(metadata),
        });
    }

    pageParsed(index, textItems) {
        const pageStage = this.state.progress.pageStage();

        if (!this.state.pages[index]) {
            this.state.pages[index] = new Page({ index, items: null });
        }
        if (!this.state.parsedPages.has(index)) {
            this.state.parsedPages.add(index);
            pageStage.stepsDone = Math.min(pageStage.stepsDone + 1, pageStage.steps);
        }
        this.state.pages[index].items = textItems; // eslint-disable-line react/no-direct-mutation-state
        console.log('[LoadingView] pageParsed index=', index, 'itemsLen=', Array.isArray(textItems) ? textItems.length : (textItems ? 1 : 0));
        this.setState({
            progress: this.state.progress
        });
    }

    fontParsed(fontId, font) {
        const fontStage = this.state.progress.fontStage();
        this.state.fontMap.set(fontId, font); // eslint-disable-line react/no-direct-mutation-state
        fontStage.stepsDone++;
        if (this.state.progress.activeStage() === fontStage) {
            this.setState({ //force rendering
                fontMap: this.state.fontMap,
            });
        }
    }

    componentDidMount() {
        if (this._didStartParse) { return; }
        this._didStartParse = true;
        const self = this;
        const fontStage = this.state.progress.fontStage();

        // 创建 ArrayBuffer 的副本以避免 detached 错误
        const fileBufferCopy = this.props.fileBuffer.slice();
        
        pdfjs.getDocument({
            data: fileBufferCopy,
            cMapUrl: 'cmaps/',
            cMapPacked: true
        }).promise.then(function(pdfDocument) { // eslint-disable-line no-undef
            // console.debug(pdfDocument);
            pdfDocument.getMetadata().then(function(metadata) {
                // console.debug(metadata);
                self.metadataParsed(metadata);
            });
            self.documentParsed(pdfDocument);
            for (var j = 1; j <= pdfDocument.numPages; j++) {
                pdfDocument.getPage(j).then(function(page) {

                    var scale = 1.0;
                    var viewport = page.getViewport({scale: scale});

                    page.getTextContent().then(function(textContent) {
                        try {
                            const textItems = (textContent.items || []).map(function(item) {
                                const fontId = item.fontName;
                                if (fontId && !self.state.fontIds.has(fontId) && typeof fontId === 'string' && fontId.indexOf('g_d0') === 0) {
                                    const transport = self.state.document && self.state.document._transport;
                                    const commonObjs = transport && transport.commonObjs;
                                    if (commonObjs && typeof commonObjs.get === 'function') {
                                        commonObjs.get(fontId, function(font) {
                                            self.fontParsed(fontId, font);
                                        });
                                    }
                                    self.state.fontIds.add(fontId);
                                    fontStage.steps = self.state.fontIds.size;
                                }

                                const baseTransform = Array.isArray(item.transform) ? item.transform : [1,0,0,1,0,0];
                                let tx = baseTransform;
                                try {
                                    if (pdfjs && pdfjs.Util && typeof pdfjs.Util.transform === 'function') {
                                        tx = pdfjs.Util.transform(viewport.transform, baseTransform);
                                    }
                                } catch (e) {}
                                const a = tx[2] || 0;
                                const b = tx[3] || 0;
                                const fontHeight = Math.sqrt(a*a + b*b) || 1;
                                const dividedHeight = item.height ? (item.height / fontHeight) : 0;
                                return new TextItem({
                                    x: Math.round(baseTransform[4] || 0),
                                    y: Math.round(baseTransform[5] || 0),
                                    width: Math.round(item.width || 0),
                                    height: Math.round(dividedHeight <= 1 ? (item.height || 0) : dividedHeight),
                                    text: item.str || '',
                                    font: fontId || ''
                                });
                            });
                            self.pageParsed(page.pageNumber - 1, textItems);
                        } catch (e) {
                            console.warn('[LoadingView] getTextContent build error, set empty for page', page.pageNumber - 1, e);
                            self.pageParsed(page.pageNumber - 1, []);
                        }
                    }).catch(function(err) {
                        console.warn('[LoadingView] getTextContent failed for page', page.pageNumber - 1, err);
                        self.pageParsed(page.pageNumber - 1, []);
                    });
                    page.getOperatorList().then(function() {
                        // do nothing... this is only for triggering the font retrieval
                    });
                });
            }
        });
    }

    componentDidUpdate() {
        const { progress, pages } = this.state;
        if (!this._didDispatchComplete && getPercentDone(progress) === 100) {
            this._didDispatchComplete = true;
            const totalItems = Array.isArray(pages) ? pages.reduce((s, p) => s + (Array.isArray(p.items) ? p.items.length : 0), 0) : 0;
            console.log('[LoadingView] dispatch storePdfPagesFunction with pages:', pages?.length, 'totalItems:', totalItems);
            this.props.storePdfPagesFunction({ pages, metadata: this.state.metadata, fontMap: this.state.fontMap });
        }
    }

    render() {
        const {pages, fontMap, metadata, progress} = this.state;
        const percentDone = getPercentDone(progress);
        const stageItems = progress.stages.filter((elem, i) => i <= progress.currentStage).map((stage, i) => {
            const progressDetails = stage.steps ? stage.stepsDone + ' / ' + stage.steps : '';
            const checkmark = stage.isComplete() ? <span style={{color: 'green'}}>✓</span> : '';
            return <div key={ i }>
                     { stage.name }
                     { ' ' + progressDetails + ' ' }
                     { checkmark }
                   </div>
        });
        return (
            <div style={ { textAlign: 'center' } }>
              <br/>
              <br/>
              <br/>
              <div style={{width: '300px', height: '20px', border: '1px solid #ccc', margin: '0 auto'}}>
                <div style={{width: percentDone + '%', height: '100%', backgroundColor: '#D3D3D3'}}></div>
              </div>
              <br/>
              <br/>
              <div>
                { stageItems }
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div>);
    }
}

function getPercentDone(progress) {
    if (progress.isComplete()) {
        return 100;
    }
    
    const activeStage = progress.activeStage();
    if (!activeStage) {
        return 100;
    }
    
    const percentDone = activeStage.percentDone();

    if (percentDone >= 100) {
        progress.completeStage();
        if (!progress.isComplete()) {
            return getPercentDone(progress);
        }
    }

    return percentDone;
}

class Progress {

    constructor(options) {
        this.stages = options.stages;
        this.currentStage = 0;
    }

    completeStage() {
        this.currentStage++;
    }

    isComplete() {
        return this.currentStage == this.stages.length;
    }

    activeStage() {
        return this.stages[this.currentStage];
    }

}

class ProgressStage {

    constructor(name, steps) {
        this.name = name;
        this.steps = steps ;
        this.stepsDone = 0;
    }

    isComplete() {
        return this.stepsDone == this.steps;
    }

    percentDone() {
        if (typeof this.steps === 'undefined' || this.steps === null) {
            return 0;
        }
        if (this.steps == 0) {
            return 100;
        }

        return Math.min(this.stepsDone / this.steps * 100, 100);
    }
}

