import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import Utils from '../constants/utils';
import { textColorStyleMap, highlightColorStyleMap } from '../constants/colors';
import { FONTS, fontStyleMap } from '../constants/fonts';
import { textSizeStyleMap } from '../constants/textSizes';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createUnderlinePlugin from "../plugins/underlinePlugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';
import linkPlugin from '../plugins/linkPlugin';
import 'draft-js/dist/Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
const resizeablePlugin = createResizeablePlugin();
const alignmentPlugin = createAlignmentPlugin();
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
);
const imagePlugin = createImagePlugin({ decorator });
const underlinePlugin = createUnderlinePlugin();
const emojiPlugin = createEmojiPlugin();
const videoPlugin = createVideoPlugin();
const { types } = videoPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [
  resizeablePlugin,
  imagePlugin,
  underlinePlugin,
  emojiPlugin,
  linkPlugin,
  videoPlugin,
  alignmentPlugin,
];


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class PreviewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currFont: FONTS[0],
      currHoverImage: "/images/close-01.png"
    }

    this.onTitleChange = (titleEditorState) => this.setState({titleEditorState});
    this.onChange = (editorState) => this.setState({editorState});
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          onClose={this.props.close}
          fullWidth={true}
          maxWidth={'lg'}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              backgroundColor: this.props.bgColor.value,
            },
          }}
        >
          <div style={{display: 'block'}}>
            <img
              src={this.state.currHoverImage}
              style={{width: '2%', margin: 20, float: 'right', cursor: 'pointer'}}
              onMouseEnter={() => {this.setState({currHoverImage: "/images/close-dark-01.png"})}}
              onMouseLeave={() => {this.setState({currHoverImage: "/images/close-01.png"})}}
              onMouseDown={this.props.close}
            />
          </div>
          <div className="dialogContent" style={{width: "50%", margin: "0px auto"}}>
            <div className="titleTextArea mainFGColor" style={{fontFamily: this.state.currFont.value}}>
              <Editor
                editorState={this.props.titleEditorState}
                onChange={this.onTitleChange}
                readOnly={true}
                blockStyleFn={Utils.getBlockStyle}
                customStyleMap={{...textColorStyleMap, ...fontStyleMap }}
              />
            </div>
            <div id="editor" className="contentTextArea mainFGColor" style={{fontFamily: this.state.currFont.value}}>
              <Editor
                editorState={this.props.editorState}
                onChange={this.onChange}
                ref="editor"
                readOnly={true}
                blockStyleFn={Utils.getBlockStyle}
                customStyleMap={{...textColorStyleMap, ...highlightColorStyleMap, ...fontStyleMap, ...textSizeStyleMap }}
                plugins={plugins}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default PreviewDialog;
