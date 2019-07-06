import React, { Component } from 'react';
import ToolMenu from './ToolMenu';
import { EditorState, RichUtils, AtomicBlockUtils, Modifier } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import Utils from '../constants/utils';
import { textColorStyleMap, highlightColorStyleMap, TEXT_COLORS, HIGHLIGHT_COLORS } from '../constants/colors';
import createFocusPlugin from 'draft-js-focus-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createHighlightPlugin from "../plugins/highlightPlugin";
import createUnderlinePlugin from "../plugins/underlinePlugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';
import linkPlugin from '../plugins/linkPlugin';
import Sticky from 'react-sticky-el';
import 'draft-js/dist/Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import autosize from 'autosize';
import $ from 'jquery';

const ReactMarkdown = require('react-markdown');
const resizeablePlugin = createResizeablePlugin();
const focusPlugin = createFocusPlugin();
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const highlightPlugin = createHighlightPlugin();
const underlinePlugin = createUnderlinePlugin();
const emojiPlugin = createEmojiPlugin();
const videoPlugin = createVideoPlugin();
const { types } = videoPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [
  resizeablePlugin,
  focusPlugin,
  imagePlugin,
  underlinePlugin,
  highlightPlugin,
  emojiPlugin,
  linkPlugin,
  videoPlugin
];

class MainHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      title: "",
      alignment: "left",
      defaultTextColor: TEXT_COLORS[0],
      defaultHighlightColor: HIGHLIGHT_COLORS[0],
      showToolbar: true,
      editorState: EditorState.createEmpty(),
    }
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
  }

  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
    var self = this;
    $("body").mousedown(function(e) {
      if (e.target.id === "editor" || $(e.target).parents("#editor").length || e.target.id === "footer" || $(e.target).parents("#footer").length) {
        self.toggleToolbar(true);
      } else {
        self.toggleToolbar(false);
      }
    });
  }

  toggleToolbar = (state) => {
    // this.setState({showToolbar: state});
  }

  newCard = () => {

  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleTitleChange = (event) => {
    this.setState({title: event.target.value});
  }

  handleTextToggleChange = (textTool) => {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      textTool.toUpperCase()
    ));
  }

  handleAlignToggleChange = (alignTool) => {
    this.setState({alignment: alignTool});
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      alignTool
    ));
  }

  handleImageTool = (base64) => {
    const newEditorState = this.insertImage(this.state.editorState, base64);
    this.onChange(newEditorState);
  }

  handleColorChange = (color, type) => {
    const selection = this.state.editorState.getSelection();
    let nextContentState;
    if (type == "text") {
      nextContentState = Object.keys(textColorStyleMap).reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, this.state.editorState.getCurrentContent());
    } else if (type == "highlight") {
      nextContentState = Object.keys(highlightColorStyleMap).reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, this.state.editorState.getCurrentContent());
    }

    let nextEditorState = EditorState.push(
      this.state.editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = this.state.editorState.getCurrentInlineStyle();
    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    // If the color is being toggled on, apply it.
    if (!currentStyle.has(color.style)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        color.style
      );
    }
    this.onChange(nextEditorState);
  }

  handleTextColorChange = (color) => {
    this.handleColorChange(color, "text");
  }

  handleHighlightColorChange = (color) => {
    this.handleColorChange(color, "highlight");
  }

  handleLinkTool = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt('Paste the URL:')
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return 'handled';
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
    const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
  }

  handleVideoTool = () => {
    const editorState = this.state.editorState;
    const link = window.prompt('Paste the video URL:');
    if (!link || !Utils.isVideo(link)) {
      alert("Please input valid video URL.");
      return;
    }
    const newEditorState = this.insertVideo(this.state.editorState, link);
    this.onChange(newEditorState);
  }

  insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  }

  insertVideo = (editorState, link) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      types.VIDEOTYPE,
      "IMMUTABLE",
      { src: link }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  }

  getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'left':
        return 'align-left';
      case 'center':
        return 'align-center';
      case 'right':
        return 'align-right';
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="container">
        <div className="navbar">
          <button className="newCardButton mainBGColor" onClick={this.newCard}>New Card</button>
          <button className="tutorialButton mainBGColor">Tutorial</button>
          <button className="shareButton mainBGColor">Share</button>
        </div>
        <div style={{clear: 'both'}}/>
        <Sticky style={{position: 'absolute', zIndex: 10}}>
          <div style={{backgroundColor: "#3e3e3e", paddingTop:20, paddingBottom: 20}}>
            <ToolMenu
              show={this.state.showToolbar}
              editorState={this.state.editorState}
              handleTextToggleChange={this.handleTextToggleChange}
              handleAlignToggleChange={this.handleAlignToggleChange}
              handleImageTool={this.handleImageTool}
              handleTextColorChange={this.handleTextColorChange}
              handleHighlightColorChange={this.handleHighlightColorChange}
              handleLinkTool={this.handleLinkTool}
              handleVideoTool={this.handleVideoTool}
              alignment={this.state.alignment}
              textColors={TEXT_COLORS}
              defaultTextColor={this.state.defaultTextColor}
              highlightColors={HIGHLIGHT_COLORS}
              defaultHighlightColor={this.state.defaultHighlightColor}
            >
              <EmojiSelect />
            </ToolMenu>
            <div style={{clear: 'both'}}/>
          </div>
        </Sticky>

        <textarea
          rows="1"
          spellCheck="false"
          placeholder="Greeting ..."
          value={this.state.title}
          onChange={this.handleTitleChange}
          className="titleTextArea mainFGColor mainBGColor"
          style={{textAlign: this.state.alignment}}
        />
        <div id="editor" className="contentTextArea mainFGColor" onClick={() => {this.toggleToolbar(true)}}>
          <Editor
            placeholder={"Write something here ..."}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            blockStyleFn={this.getBlockStyle}
            ref="editor"
            plugins={plugins}
            customStyleMap={{...textColorStyleMap, ...highlightColorStyleMap }}
          />
          <EmojiSuggestions />
        </div>
        {/*<ReactMarkdown source={this.state.body} />*/}
      </div>
    )
  }
}

export default MainHome;
