import { Editor } from 'draft-js';

export type EditorRef = Editor & {
  editor: HTMLElement;
  editorContainer: HTMLElement;
};
