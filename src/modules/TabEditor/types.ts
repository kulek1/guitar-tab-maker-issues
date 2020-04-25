import { Editor } from 'draft-js';

export type CursorPosition = {
  focusKey: string | null;
  focusOffset: number | null;
};

export type EditorRef = Editor & {
  editor: HTMLElement;
  editorContainer: HTMLElement;
};
