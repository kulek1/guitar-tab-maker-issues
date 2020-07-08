import SVGtoPDF from 'svg-to-pdfkit';
import { EditorState } from 'AppContext';
import { TabNote } from 'types/notes';

const { vextab } = window as any;
const { Renderer } = vextab.Vex.Flow;
const { VexTab, Artist, Vex } = vextab;

function insert(str: string, index: number, value: string): string {
  return str.substr(0, index) + value + str.substr(index);
}

export const generatePreview = (htmlElement: HTMLElement, vextabSyntax: string): void => {
  // // Create VexFlow Renderer from canvas element with id #boo
  htmlElement.innerHTML = ''; // clear previous tabs
  const renderer = new Renderer(htmlElement, Renderer.Backends.SVG);
  // Initialize VexTab artist and parser.
  const artist = new Artist(10, 10, 600, { scale: 0.8 });
  const tab = new VexTab(artist);
  try {
    tab.parse(vextabSyntax);
    artist.render(renderer);
  } catch (e) {
    console.error(e);
  }
};
export const generatePDF = (svg: string): void => {
  const doc = new (window as any).PDFDocument();
  const chunks = [];
  const stream = doc.pipe({
    // @ts-ignore
    write: (chunk) => chunks.push(chunk),
    end: () => {
      const pdfBlob = new Blob(chunks, {
        type: 'application/octet-stream',
      });
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl);
    },
    // readable streaaam stub iplementation
    on: (event, action) => {},
    once: (...args) => {},
    emit: (...args) => {},
  });

  SVGtoPDF(doc, svg, 0, 0);

  doc.end();
};

export const generateVextabSyntax = (editorState: EditorState): string => {
  const response = Object.keys(editorState).map((tabKey) => {
    const { notes } = editorState[tabKey];
    return notes.reduce((accumulator, currentTabColumnArray) => {
      // join tab column array into one string
      const column = currentTabColumnArray.reduce(
        (columnAccumulator: string, currentNote: number, currentNoteIndex: number) => {
          if (typeof currentNote === 'number') {
            const shouldAddSeparator = columnAccumulator !== '()';
            const newNote = insert(
              columnAccumulator,
              columnAccumulator.length - 1,
              `${shouldAddSeparator ? '.' : ''}${currentNote}/${currentNoteIndex + 1}`
            );
            return newNote;
          }
          return columnAccumulator;
        },
        '()'
      );
      if (column !== '()') {
        return `${accumulator}${column} `;
      }
      return accumulator;
    }, 'notes ');
  });

  return `
  tabstave
  ${response.join(`
  tabstave
  `)}
  `;
};

export const saveToPdf = (htmlContainer: HTMLElement, editorState: EditorState): void => {
  const vextabSyntax = generateVextabSyntax(editorState);
  generatePreview(htmlContainer, vextabSyntax);
  const svg = htmlContainer.querySelector('svg')?.outerHTML;

  if (svg) {
    generatePDF(svg);
  }
};
