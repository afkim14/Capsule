import { RichUtils } from 'draft-js';

export default (color) => {
  return {
    customStyleMap: {
      'COLOR': {
        color: color,
      }
    },
    keyBindingFn : e => {
      if (e.metaKey && e.key === "k") {
        return "color";
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === "color") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "COLOR"));
        return true;
      }
    }
  }
}
