import { RichUtils } from 'draft-js';

export default () => {
  return {
    customStyleMap: {
      'UNDERLINE': {
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderRadius: 1,
        paddingBottom: 1
      }
    },
    keyBindingFn : e => {
      if (e.metaKey && e.key === "u") {
        return "underline";
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === "underline") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
        return true;
      }
    }
  }
}
