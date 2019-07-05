import { RichUtils } from 'draft-js';

export default (color) => {
  return {
    customStyleMap: {
      'HIGHLIGHT': {
        padding: 2,
      }
    },
    keyBindingFn : e => {
      if (e.metaKey && e.key === "h") {
        return "highlight";
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === "highlight") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
        return true;
      }
    }
  }
}
