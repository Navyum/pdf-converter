// A page which holds PageItems displayable via PdfPageView
export default class Page {

    constructor(options) {
        this.index = options.index;
        this.items = (typeof options.items !== 'undefined') ? options.items : null; // PageItem[] | null
    }

}
