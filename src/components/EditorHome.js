import React, { Component } from 'react';
import ToolMenu from './ToolMenu';
import { EditorState, RichUtils, AtomicBlockUtils, Modifier, ContentState, SelectionState, getDefaultKeyBinding, KeyBindingUtil, convertFromRaw, convertToRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import Utils from '../constants/utils';
import placeholders from '../constants/placeholders';
import { textColorStyleMap, highlightColorStyleMap, TEXT_COLORS, HIGHLIGHT_COLORS, BACKGROUND_COLORS } from '../constants/colors';
import { FONTS, fontStyleMap } from '../constants/fonts';
import { TEXT_SIZES, textSizeStyleMap } from '../constants/textSizes';
import { NoLinkTextMsg, NoLinkMsg, InvalidImageMsg, InvalidVideoMsg, NoVideoMsg, SucessSharingMsg, ErrorSharingMsg, NoContentToShareMsg } from '../constants/notifications';
import NewCardDialog from './NewCardDialog';
import TutorialDialog from './TutorialDialog';
import ShareDialog from './ShareDialog';
import LinkInputDialog from './LinkInputDialog';
import createStyles from 'draft-js-custom-styles';
import createFocusPlugin from 'draft-js-focus-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createUnderlinePlugin from "../plugins/underlinePlugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createAutoListPlugin from 'draft-js-autolist-plugin';
import linkPlugin from '../plugins/linkPlugin';
import Sticky from 'react-sticky-el';
import 'draft-js/dist/Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import autosize from 'autosize';
import $ from 'jquery';
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/customToastifyStyle.css';
import firebase from 'firebase';
toast.configure({
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  transition: Slide,
  newestOnTop: true,
});

const password = require('secure-random-password');
// const ReactMarkdown = require('react-markdown');
// const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'CUSTOM_', fontStyleMap);
const resizeablePlugin = createResizeablePlugin();
const focusPlugin = createFocusPlugin();
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const underlinePlugin = createUnderlinePlugin();
const emojiPlugin = createEmojiPlugin();
const videoPlugin = createVideoPlugin();
const autoListPlugin = createAutoListPlugin()
const { types } = videoPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const singleLinePlugin = createSingleLinePlugin();
const titlePlugins = [
  singleLinePlugin
];
const plugins = [
  resizeablePlugin,
  focusPlugin,
  imagePlugin,
  underlinePlugin,
  emojiPlugin,
  linkPlugin,
  videoPlugin,
  autoListPlugin
];

let keyHistory = [{shift: false, value: " "}, {shift: false, value: " "}];

class EditorHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    let mainBGColor = BACKGROUND_COLORS[0];
    this.state = {
      titleOnFocus: false,
      bodyPlaceholder: placeholders[Math.floor(Math.random() * placeholders.length)],
      defaultAlignment: "align-left",
      defaultFont: FONTS[0],
      currFont: FONTS[0],
      currBGColor: mainBGColor,
      defaultTextColor: TEXT_COLORS[0],
      defaultHighlightColor: mainBGColor,
      secondaryHighlightColor: HIGHLIGHT_COLORS[0],
      defaultTextSize: TEXT_SIZES[0],
      showToolbar: true,
      titleEditorState: EditorState.createEmpty(),
      editorState: EditorState.createEmpty(),
      openNewCardDialog: false,
      openTutorialDialog: false,
      openShareDialog: false,
      openLinkInputDialog: false,

      shareLink: null,
      cardKey: null,
      password: null,
      currLinkTool: null,
    }

    this.onTitleChange = (titleEditorState) => this.setState({titleEditorState});
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: " + this.state.currBGColor.value + ";");
    autosize(document.querySelectorAll('textarea'));
  }

  newCard = () => {
    const titleEditorState = EditorState.push(this.state.titleEditorState, ContentState.createFromText(''));
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
    this.setState({ openNewCardDialog: false, titleEditorState, editorState });
  }

  shareCard = (e) => {
    e.preventDefault();
    const titleContent = this.state.editorState.getCurrentContent();
    const isTitleEmpty = !titleContent.hasText();
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (!isEditorEmpty && !isTitleEmpty) {
      // the raw state, stringified
      const maxPasswordLength = 20;
      const minPasswordLength = 10;
      const pw = password.randomPassword({length: Math.floor(Math.random() * (maxPasswordLength - minPasswordLength) + minPasswordLength)});
      const rawTitleContentState = JSON.stringify( convertToRaw(this.state.titleEditorState.getCurrentContent()) );
      const rawDraftContentState = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent()) );
      const newCard = {
        title: rawTitleContentState,
        data: rawDraftContentState,
        password: pw,
        bgColor: this.state.currBGColor.value,
        font: this.state.currFont.value
      }

      firebase.app().database().ref('/').push({
        ...newCard
      }).then((data) => {
        this.setState({openShareDialog: true, shareLink: 'localhost:3000/cards/' + data.getKey(), cardKey: data.getKey(), password: pw});
      }).catch((error) => {
        toast.error(<ErrorSharingMsg />);
      });
    } else {
      toast.error(<NoContentToShareMsg />);
    }
  }

  openNewCardDialog = (e) => {
    e.preventDefault();
    const titleContent = this.state.titleEditorState.getCurrentContent();
    const isTitleEmpty = !titleContent.hasText();
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (!isEditorEmpty || !isTitleEmpty) {
      this.setState({openNewCardDialog: true});
    }
  }

  openTutorialDialog = (e) => {
    e.preventDefault();
    this.setState({openTutorialDialog: true});
  }

  openLinkInputDialog = (tool) => {
    this.setState({openLinkInputDialog: true, currLinkTool: tool});
  }

  handleKeyDown = (event) => {
    switch( event.keyCode ) {
      case 8: // BACKSPACE_KEY
          this.handleTextDelete();
          break;
      default:
          break;
    }
  }

  myKeyBindingFn = (e) => {
    keyHistory[0] = {shift: keyHistory[1].shift, value: keyHistory[1].value};
    keyHistory[1].shift = e.shiftKey;
    keyHistory[1].value = e.keyCode;
    if (e.keyCode === 83 /* `S` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'myeditor-save';
    } else if (e.keyCode === 72 /* `H` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      let highlightStyle = this.state.secondaryHighlightColor.style;
      let filteredHighlightStyle = HIGHLIGHT_COLORS.filter(c => { return this.state.editorState.getCurrentInlineStyle().has(c.style) });
      if (filteredHighlightStyle.length > 0) {
        return filteredHighlightStyle[0].style;
      }
      return highlightStyle;
    } else if (e.keyCode === 75 /* `K` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'add-link';
    } else if (e.keyCode === 49 /* `1` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'align-left';
    } else if (e.keyCode === 50 /* `2` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'align-center';
    } else if (e.keyCode === 51 /* `3` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'align-right';
    } else if (e.keyCode === 32) {
      if (keyHistory[0].value === 189 || (keyHistory[0].shift && keyHistory[0].value === 56)) {
        let editorState = this.state.editorState;
        let selectionState = editorState.getSelection();
        let anchorKey = selectionState.getAnchorKey();
        let currContent = editorState.getCurrentContent();
        let currContentBlock = currContent.getBlockForKey(anchorKey);
        let currContentBlockType = currContentBlock.getType();
        let currContentBlockDepth = currContentBlock.getDepth();
        let newSelection = new SelectionState({
          anchorKey: anchorKey,
          anchorOffset: 0,
          focusKey: anchorKey,
          focusOffset: currContentBlock.getLength()
        });
        var start = newSelection.getStartOffset();
        var end = newSelection.getEndOffset();
        var selectedText = currContentBlock.getText().slice(start, end);
        if (currContentBlockType != "unordered-list-item" && currContentBlockDepth == 0 && selectedText === "-" || selectedText ==="*") {
          return 'list'
        }
      }
    }
    return getDefaultKeyBinding(e);
  }

  handleKeyCommand = (command, editorState) => {
    // console.log(command);
    // CUSTOM
    if (command.includes('highlight')) {
      this.onChange(RichUtils.toggleInlineStyle(editorState, command));
      return 'handled';
    } else if (command.includes('link')) {
      this.openLinkInputDialog('link');
      return 'handled';
    } else if (command.includes('align')) {
      this.handleAlignToggleChange(command);
      return 'handled';
    } else if (command.includes('list')) {
      let editorState = this.state.editorState;
      let selectionState = editorState.getSelection();
      let anchorKey = selectionState.getAnchorKey();
      let currContent = editorState.getCurrentContent();
      var currentContentBlock = currContent.getBlockForKey(anchorKey);
      let newSelection = new SelectionState({
        anchorKey: anchorKey,
        anchorOffset: 0,
        focusKey: anchorKey,
        focusOffset: currentContentBlock.getLength()
      });
      let nextContentState = Modifier.replaceText(currContent, newSelection, "");
      let nextEditorState = EditorState.push(
        this.state.editorState,
        nextContentState
      );

      let newEditorState = RichUtils.toggleBlockType(
        nextEditorState,
        'unordered-list-item'
      );

      this.onChange(EditorState.moveFocusToEnd(newEditorState));
      return 'handled';
    }

    // DEFAULT: BOLD, ITALIC, UNDERLINE
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleTextDelete = () => {
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (isEditorEmpty) {
      this.onChange(RichUtils.toggleBlockType(
        this.state.editorState,
        this.state.defaultAlignment
      ));
    }
  }

  handleTextToggleChange = (textTool) => {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      textTool.toUpperCase()
    ));
  }

  handleCustomTextChange = (styleMap, style) => {
    let editorState = this.state.titleOnFocus ? this.state.titleEditorState : this.state.editorState;
    const selection = editorState.getSelection();
    let nextContentState = Object.keys(styleMap).reduce((contentState, style) => {
      return Modifier.removeInlineStyle(contentState, selection, style)
    }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();
    // Unset style override for current font.
    if (selection.isCollapsed()) {
      Object.keys(styleMap).forEach(style => {
        if (currentStyle.has(style)) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
        }
      });
    }
    // If the font is being toggled on, apply it.
    if (!currentStyle.has(style.style)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        style.style
      );
    }
    this.state.titleOnFocus ? this.onTitleChange(nextEditorState) : this.onChange(nextEditorState);
  }

  handleGlobalTextChange = (styleMap, style) => {
    let editorState = this.state.titleOnFocus ? this.state.titleEditorState : this.state.editorState;
    let currentContent = editorState.getCurrentContent();
    const firstBlock = currentContent.getBlockMap().first();
    const lastBlock = currentContent.getBlockMap().last();
    const firstBlockKey = firstBlock.getKey();
    const lastBlockKey = lastBlock.getKey();
    const lengthOfLastBlock = lastBlock.getLength();

    let newSelection = new SelectionState({
      anchorKey: firstBlockKey,
      anchorOffset: 0,
      focusKey: lastBlockKey,
      focusOffset: lengthOfLastBlock
    });

    let nextContentState = Object.keys(styleMap).reduce((newContentState, style) => (
      Modifier.removeInlineStyle(newContentState, newSelection, style)
    ), currentContent);

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    nextEditorState = RichUtils.toggleInlineStyle(
      nextEditorState,
      style.style
    );

    // highlights entire text after changing font
    nextEditorState = EditorState.forceSelection(nextEditorState, newSelection);
    this.state.titleOnFocus ? this.onTitleChange(nextEditorState) : this.onChange(nextEditorState);
  }

  handleStickerTool = (sticker) => {
    var request = new XMLHttpRequest();
    request.open('GET', sticker.url, true);
    request.responseType = 'blob';
    request.onload = () => {
        this.handleImageTool(request.response);
    };
    request.send();
  }

  handleTextColorChange = (color) => {
    this.handleCustomTextChange(textColorStyleMap, color);
  }

  handleHighlightColorChange = (color) => {
    this.handleCustomTextChange(highlightColorStyleMap, color);
  }

  handleBulletToolToggle = (tool) => {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'unordered-list-item'
    ));
  }

  handleBGChange = (color, e) => {
    e.preventDefault();
    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: " + color.value + ";");
    this.setState({currBGColor: color, defaultHighlightColor: color});
  }

  handleFontTool = (font) => {
    // Apply only to some text (selection)
    //this.handleCustomTextChange(fontStyleMap, font);

    // Apply globally
    this.setState({currFont: font});
    //this.handleGlobalTextChange(fontStyleMap, font);
  }

  handleTextSizeChange = (size) => {
    this.handleCustomTextChange(textSizeStyleMap, size);
  }

  handleAlignToggleChange = (alignTool) => {
    let editorState = this.state.titleOnFocus ? this.state.titleEditorState : this.state.editorState;
    let nextEditorState = RichUtils.toggleBlockType(editorState, alignTool);
    this.state.titleOnFocus ? this.onTitleChange(nextEditorState) : this.onChange(nextEditorState);
  }

  handleImageTool = (file) => {
    try {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const newEditorState = this.insertImage(this.state.editorState, reader.result);
        this.onChange(newEditorState);
      };
      reader.onerror = function (error) {
        toast.error(<InvalidImageMsg />);
      };
    } catch(err) {
      // toast.error(<InvalidImageMsg />);
      return;
    }
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

  handleVideoTool = (link) => {
    this.setState({openLinkInputDialog: false});
    const editorState = this.state.editorState;
    if (link === null) {
      return;
    }
    if (link === '') {
      toast.error(<NoVideoMsg />);
      return;
    }
    if (!Utils.isVideo(link)) {
      toast.error(<InvalidVideoMsg />);
      return;
    }
    const newEditorState = this.insertVideo(this.state.editorState, link);
    this.onChange(newEditorState);
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

  handleLinkTool = (link) => {
    this.setState({openLinkInputDialog: false});
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();

    if (selection.isCollapsed()) {
      toast.info(<NoLinkTextMsg />);
      return;
    }

    if (link === null) {
      return;
    }
    if (link === '') {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      toast.error(<NoLinkMsg />);
      return 'handled';
    }
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
    const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
  }

  render() {
    return (
      <div className="container">
        <NewCardDialog
          open={this.state.openNewCardDialog}
          close={() => {this.setState({openNewCardDialog: false})}}
          handleCancelNewCard={() => {this.setState({openNewCardDialog: false})}}
          handleAcceptNewCard={() => {this.newCard()}}
        />
        <TutorialDialog
          open={this.state.openTutorialDialog}
          close={() => {this.setState({openTutorialDialog: false})}}
        />
        <ShareDialog
          open={this.state.openShareDialog}
          close={() => {this.setState({openShareDialog: false})}}
          shareLink={this.state.shareLink}
          cardKey={this.state.cardKey}
          password={this.state.password}
        />
        <LinkInputDialog
          open={this.state.openLinkInputDialog}
          close={() => {this.setState({openLinkInputDialog: false})}}
          handleLinkTool={this.handleLinkTool}
          handleVideoTool={this.handleVideoTool}
          currLinkTool={this.state.currLinkTool}
        />
        <div className="navbar">
          <button className="newCardButton" style={{backgroundColor: this.state.currBGColor.value}} onMouseDown={(e) => {this.openNewCardDialog(e)}}>New Card</button>
          <button className="tutorialButton" style={{backgroundColor: this.state.currBGColor.value}} onMouseDown={(e) => {this.openTutorialDialog(e)}}>Tutorial</button>
          <button className="shareButton" style={{backgroundColor: this.state.currBGColor.value}} onMouseDown={(e) => {this.shareCard(e)}}>Share</button>
        </div>
        <div style={{clear: 'both'}}/>
        <Sticky style={{position: 'absolute', zIndex: 10}}>
          <div style={{paddingTop:20, paddingBottom: 20, backgroundColor: this.state.currBGColor.value}}>
            <ToolMenu
              show={this.state.showToolbar}
              titleOnFocus={this.state.titleOnFocus}
              titleEditorState={this.state.titleEditorState}
              editorState={this.state.editorState}
              handleTextToggleChange={this.handleTextToggleChange}
              handleAlignToggleChange={this.handleAlignToggleChange}
              handleImageTool={this.handleImageTool}
              handleTextColorChange={this.handleTextColorChange}
              handleFontTool={this.handleFontTool}
              handleHighlightColorChange={this.handleHighlightColorChange}
              handleTextSizeChange={this.handleTextSizeChange}
              handleStickerTool={this.handleStickerTool}
              handleBulletToolToggle={this.handleBulletToolToggle}
              openLinkInputDialog={this.openLinkInputDialog}
              defaultAlignment={this.state.defaultAlignment}
              fonts={FONTS}
              currFont={this.state.currFont}
              currBGColor={this.state.currBGColor}
              backgroundColors={BACKGROUND_COLORS}
              handleBGChange={this.handleBGChange}
              defaultFont={this.state.defaultFont}
              textColors={TEXT_COLORS}
              defaultTextColor={this.state.defaultTextColor}
              highlightColors={HIGHLIGHT_COLORS}
              defaultHighlightColor={this.state.defaultHighlightColor}
              textSizes={TEXT_SIZES}
              defaultTextSize={this.state.defaultTextSize}
            >
              <EmojiSelect />
            </ToolMenu>
            <div style={{clear: 'both'}}/>
          </div>
        </Sticky>
        <div className="titleTextArea mainFGColor" style={{fontFamily: this.state.currFont.value}}>
          <Editor
            placeholder={"Hey Jude,"}
            editorState={this.state.titleEditorState}
            onChange={this.onTitleChange}
            onBlur={() => {this.setState({titleOnFocus: false})}}
            onFocus={() => {this.setState({titleOnFocus: true})}}
            blockStyleFn={Utils.getBlockStyle}
            customStyleMap={{...textColorStyleMap }}
            plugins={titlePlugins}
          />
        </div>
        <div id="editor" className="contentTextArea mainFGColor" style={{fontFamily: this.state.currFont.value, fontSize: this.state.defaultTextSize.value}}>
          <Editor
            placeholder={this.state.bodyPlaceholder}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.myKeyBindingFn}
            onChange={this.onChange}
            blockStyleFn={Utils.getBlockStyle}
            ref="editor"
            plugins={plugins}
            customStyleMap={{...textColorStyleMap, ...highlightColorStyleMap, ...fontStyleMap, ...textSizeStyleMap }}
          />
          <EmojiSuggestions />
        </div>
        {/*<ReactMarkdown source={this.state.body} />*/}
      </div>
    )
  }
}

export default EditorHome;
