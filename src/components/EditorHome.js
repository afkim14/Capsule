import React, { Component } from 'react';
import ToolMenu from './ToolMenu';
import { EditorState, RichUtils, AtomicBlockUtils, Modifier, ContentState, SelectionState, getDefaultKeyBinding, KeyBindingUtil, convertFromRaw, convertToRaw, genKey, ContentBlock } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import { List } from 'immutable'
import Utils from '../constants/utils';
import { TITLE_PLACEHOLDERS, BODY_PLACEHOLDERS } from '../constants/placeholders';
import { textColorStyleMap, highlightColorStyleMap, TEXT_COLORS, HIGHLIGHT_COLORS, BACKGROUND_COLORS } from '../constants/colors';
import { FONTS, fontStyleMap } from '../constants/fonts';
import { TEXT_SIZES, textSizeStyleMap } from '../constants/textSizes';
import { TemplateIDs } from '../constants/templates';
import { NoLinkTextMsg, NoLinkMsg, InvalidImageMsg, InvalidVideoMsg, NoVideoMsg, SucessSharingMsg, ErrorSharingMsg, NoContentToShareMsg, ResizeImageMsg, SelectionImageMsg } from '../constants/notifications';
import EmptyCardDialog from './EmptyCardDialog';
import TutorialDialog from './TutorialDialog';
import AddPasswordDialog from './AddPasswordDialog';
import ShareDialog from './ShareDialog';
import LinkInputDialog from './LinkInputDialog';
import BrushDialog from './BrushDialog';
import AddStampDialog from './AddStampDialog';
import PreviewDialog from './PreviewDialog';
import createStyles from 'draft-js-custom-styles';
import createFocusPlugin from 'draft-js-focus-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createUnderlinePlugin from "../plugins/underlinePlugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import linkPlugin from '../plugins/linkPlugin';
import Sticky from 'react-sticky-el';
import 'draft-js/dist/Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-alignment-plugin/lib/plugin.css';
import autosize from 'autosize';
import $ from 'jquery';
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/customToastifyStyle.css';
import '../styles/customAlignmentStyle.css';
import { Link, Redirect } from 'react-router-dom'
import firebase from 'firebase';
import SignatureCanvas from 'react-signature-canvas';
import ReactLoading from 'react-loading';
import ScrollToTop from './ScrollToTop';

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
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
  alignmentPlugin.decorator,
);
const imagePlugin = createImagePlugin({ decorator });
const underlinePlugin = createUnderlinePlugin();
const selectButtonEmojis = ['😝', '😊', '🤔', '🥺', '🤣', '😳'];
const emojiPlugin = createEmojiPlugin({
  selectButtonContent: selectButtonEmojis[Math.floor(Math.random() * selectButtonEmojis.length)]
});
const videoPlugin = createVideoPlugin();
const { types } = videoPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const singleLinePlugin = createSingleLinePlugin();
const titlePlugins = [
  // singleLinePlugin
];
const plugins = [
  resizeablePlugin,
  focusPlugin,
  alignmentPlugin,
  imagePlugin,
  underlinePlugin,
  emojiPlugin,
  linkPlugin,
  videoPlugin,
];

const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';
const STATE_REDIRECTHOME = 'redirectHome';
const mainBGColor = BACKGROUND_COLORS[0];
let keyHistory = [{shift: false, value: " "}, {shift: false, value: " "}];

const addEmptyBlock = (editorState) => {
  const newBlock = new ContentBlock({
    key: genKey(),
    type: 'unstyled',
    text: '',
    characterList: List()
  })

  const contentState = editorState.getCurrentContent()
  const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock)

  return [EditorState.push(
    editorState,
    ContentState
      .createFromBlockArray(newBlockMap.toArray())
      .set('selectionBefore', contentState.getSelectionBefore())
      .set('selectionAfter', contentState.getSelectionAfter())
  ), newBlock.key];
}

class EditorHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      status: STATE_LOADING,
      titleOnFocus: false,
      titlePlaceholder: TITLE_PLACEHOLDERS[Math.floor(Math.random() * TITLE_PLACEHOLDERS.length)],
      bodyPlaceholder: BODY_PLACEHOLDERS[Math.floor(Math.random() * BODY_PLACEHOLDERS.length)],
      bodyOnFocus: false,
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
      emptyCardCallback: null,
      openEmptyCardDialog: false,
      openTutorialDialog: false,
      openShareDialog: false,
      openLinkInputDialog: false,
      openAddPasswordDialog: false,
      openBrushDialog: false,
      openAddStampDialog: false,
      openPreviewDialog: false,
      currSelectedStamp: null,
      firstImageInserted: false,
      getStartedMode: false,

      cardKey: null,
      password: null,
      currLinkTool: null,
    }

    this.onTitleChange = (titleEditorState) => this.setState({titleEditorState});
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
  }

  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
    let cardKey = window.location.pathname.split("/").slice(-1)[0];
    if (cardKey === "getstarted") {
      this.setState({openTutorialDialog: true, status: STATE_LOADED});
    } else if (cardKey != "editor") {
      if (TemplateIDs.filter(t => {return t.id === cardKey}).length === 0) { this.setState({status: STATE_LOADED}); }
      try {
        firebase.database().ref("/Cards/" + cardKey).once('value', (snapshot) => {
          const pulledData = snapshot.val();
          if (pulledData) {
            const titleContentState = convertFromRaw( JSON.parse( pulledData['title'] ) )
            const contentState = convertFromRaw( JSON.parse( pulledData['data'] ) );
            document.getElementsByTagName("html")[0].setAttribute("style", "background-color: " + pulledData['bgColor'].value + ";");
            this.setState({
              editorState: EditorState.createWithContent(contentState),
              titleEditorState: EditorState.createWithContent(titleContentState),
              currBGColor: pulledData['bgColor'],
              defaultHighlightColor: pulledData['bgColor'],
              status: STATE_LOADED
            });
          } else {
            this.setState({status: STATE_LOADED});
          }
        });
      } catch (err) {
        this.setState({status: STATE_LOADED});
      }
    } else {
      this.setState({status: STATE_LOADED});
    }

    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: " + this.state.currBGColor.value + ";");
  }

  emptyCard = (e) => {
    e.preventDefault();
    const titleContent = this.state.titleEditorState.getCurrentContent();
    const isTitleEmpty = !titleContent.hasText();
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (!isEditorEmpty || !isTitleEmpty) {
      this.setState({openEmptyCardDialog: true, emptyCardCallback: () => {this.newCard()}});
    }
  }

  goHome = () => {
    const titleContent = this.state.titleEditorState.getCurrentContent();
    const isTitleEmpty = !titleContent.hasText();
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (!isEditorEmpty || !isTitleEmpty) {
      this.setState({openEmptyCardDialog: true, emptyCardCallback: () => {this.setState({status: STATE_REDIRECTHOME, openEmptyCardDialog: false})}});
    } else {
      this.setState({status: STATE_REDIRECTHOME});
    }
  }

  newCard = () => {
    const titleEditorState = EditorState.push(this.state.titleEditorState, ContentState.createFromText(''));
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: " + mainBGColor.value + ";");
    this.setState({
      openEmptyCardDialog: false,
      titleEditorState,
      editorState,
      currBGColor: mainBGColor,
      defaultHighlightColor: mainBGColor,
      currFont: this.state.defaultFont,
    });
  }

  shareCard = (password, callback) => {
    // this.setState({openAddPasswordDialog: false, openShareDialog: true, cardKey: 'test', password: 'password'});
    // callback();

    const rawTitleContentState = JSON.stringify( convertToRaw(this.state.titleEditorState.getCurrentContent()) );
    const rawDraftContentState = JSON.stringify( convertToRaw(this.state.editorState.getCurrentContent()) );
    const newCard = {
      title: rawTitleContentState,
      data: rawDraftContentState,
      password: password,
      bgColor: this.state.currBGColor,
      // font: this.state.currFont,
      stampURL: this.state.currSelectedStamp.src
    }

    firebase.app().database().ref('/Cards/').push({
      ...newCard
    }).then((data) => {
      callback();
      this.setState({openAddPasswordDialog: false, openShareDialog: true, cardKey: data.getKey(), password: password});
    }).catch((error) => {
      toast.error(<ErrorSharingMsg />);
    });
  }

  openPreview = (e) => {
    e.preventDefault();
    const titleContent = this.state.editorState.getCurrentContent();
    const isTitleEmpty = !titleContent.hasText();
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (!isEditorEmpty && !isTitleEmpty) {
      this.setState({openPreviewDialog: true});
    } else {
      toast.error(<NoContentToShareMsg />);
    }
  }

  openTutorialDialog = (e) => {
    e.preventDefault();
    this.setState({openTutorialDialog: true});
  }

  openLinkInputDialog = (tool) => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    if (selection.isCollapsed() && tool === 'link') {
      this.onChange(EditorState.forceSelection(editorState, selection));
      toast.error(<NoLinkTextMsg />);
      return;
    }

    this.setState({openLinkInputDialog: true, currLinkTool: tool});
  }

  openAddStampDialog = (e) => {
    const titleContent = this.state.editorState.getCurrentContent();
    const isTitleEmpty = !titleContent.hasText();
    const content = this.state.editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    if (!isEditorEmpty && !isTitleEmpty) {
      this.setState({openAddStampDialog: true});
    } else {
      toast.error(<NoContentToShareMsg />);
    }
  }

  confirmStamp = (stamp) => {
    this.setState({currSelectedStamp: stamp, openAddStampDialog: false, openAddPasswordDialog: true});
  }

  titleKeyBindingFn = (e) => {
    if (e.keyCode === 13) {
      return 'focus-body';
    } else if (e.keyCode === 72 /* `H` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'no-action';
    } else if (e.keyCode === 66 /* `B` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'no-action';
    } else if (e.keyCode === 85 /* `U` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'no-action';
    } else if (e.keyCode === 73 /* `I` key */ && KeyBindingUtil.hasCommandModifier(e)) {
      return 'no-action';
    }
    return getDefaultKeyBinding(e);
  }

  handleTitleKeyCommand = (command, editorState) => {
    if (command === 'focus-body') {
      this.focus();
      return 'handled';
    } else if (command === 'no-action') {
      return 'handled';
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
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
        if (currContentBlockType != "unordered-list-item" && currContentBlockDepth == 0 && selectedText[0] === "-" || selectedText[0] ==="*") {
          return 'list'
        }
      } else if (keyHistory[0].shift && keyHistory[0].value === 51) {
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
        if (currContentBlockType != "unordered-list-item" && currContentBlockDepth == 0 && selectedText[0] === "#") {
          return 'header'
        }
      }
    } else if (e.keyCode === 13 /* ENTER */) {
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
      if (selectedText.length === 0 && currContentBlockType === 'unordered-list-item') {
        return 'remove-bulletpoint'
      }

      var newEditorState = EditorState.forceSelection(editorState, newSelection);
      if (selectedText.length > 0 && newEditorState.getCurrentInlineStyle().has(TEXT_SIZES[1].style)) {
        return 'remove-header'
      }
    }

    return getDefaultKeyBinding(e);
  }

  handleKeyCommand = (command, editorState) => {
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
        focusOffset: 1
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

      newSelection = new SelectionState({
        anchorKey: anchorKey,
        anchorOffset: 0,
        focusKey: anchorKey,
        focusOffset: 0
      });
      newEditorState = EditorState.forceSelection(newEditorState, newSelection);

      let currentStyle = newEditorState.getCurrentInlineStyle();
      let styles = ['BOLD', 'UNDERLINE'];
      styles.forEach(style => {
        if (currentStyle.has(style)) {
          newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
        }
      });
      if (currentStyle.has(TEXT_SIZES[1].style)) {
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, TEXT_SIZES[1].style);
      }

      this.onChange(newEditorState);

      return 'handled';
    } else if (command === "remove-bulletpoint") {
      this.onChange(RichUtils.toggleBlockType(
        this.state.editorState,
        'unstyled'
      ));
      return 'handled';
    } else if (command === "header") {
      let editorState = this.state.editorState;
      let selectionState = editorState.getSelection();
      let anchorKey = selectionState.getAnchorKey();
      let currContent = editorState.getCurrentContent();
      var currentContentBlock = currContent.getBlockForKey(anchorKey);
      let newSelection = new SelectionState({
        anchorKey: anchorKey,
        anchorOffset: 0,
        focusKey: anchorKey,
        focusOffset: 1
      });

      let nextContentState = Modifier.replaceText(currContent, newSelection, "");
      let nextEditorState = EditorState.push(
        this.state.editorState,
        nextContentState
      );

      newSelection = new SelectionState({
        anchorKey: anchorKey,
        anchorOffset: 0,
        focusKey: anchorKey,
        focusOffset: currentContentBlock.getLength()-1
      });

      nextEditorState = EditorState.forceSelection(nextEditorState, newSelection);
      let currentStyle = nextEditorState.getCurrentInlineStyle();
      let styles = ['BOLD', 'UNDERLINE', 'ITALIC'];
      styles.forEach(style => {
        if (currentStyle.has(style)) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
        }
      });
      Object.keys(textSizeStyleMap).forEach(style => {
        if (currentStyle.has(style)) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
        }
      });

      let newEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        TEXT_SIZES[1].style
      );
      newEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        'BOLD'
      );

      if (newSelection.isCollapsed()) {
        this.onChange(newEditorState);
      } else {
        newSelection = new SelectionState({
          anchorKey: anchorKey,
          anchorOffset: 0,
          focusKey: anchorKey,
          focusOffset: 0
        });
        this.onChange(EditorState.forceSelection(newEditorState, newSelection));
      }
      return 'handled';
    } else if (command === 'remove-header') {
      const selection = editorState.getSelection();
      let contentState = editorState.getCurrentContent();
      contentState = Modifier.splitBlock(contentState, selection);
      const currentBlock = contentState.getBlockForKey(selection.getEndKey());
      const nextBlock = contentState
        .getBlockMap()
        .toSeq()
        .skipUntil(function(v) {
          return v === currentBlock;
        })
        .rest()
        .first();
      const nextBlockKey = nextBlock.getKey();
      let newSelection = new SelectionState({
        anchorKey: nextBlockKey,
        anchorOffset: 0,
        focusKey: nextBlockKey,
        focusOffset: 0
      });

      let nextEditorState = EditorState.push(editorState, contentState, 'split-block');
      nextEditorState = EditorState.forceSelection(nextEditorState, newSelection);

      let currentStyle = nextEditorState.getCurrentInlineStyle();
      let styles = ['BOLD'];
      styles.forEach(style => {
        if (currentStyle.has(style)) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
        }
      });
      Object.keys(textSizeStyleMap).forEach(style => {
        if (currentStyle.has(style)) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
        }
      });
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        TEXT_SIZES[0].style
      );
      this.onChange(nextEditorState);
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
    return nextEditorState;
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
    this.handleCustomTextChange(fontStyleMap, font);

    // Apply globally
    // this.setState({currFont: font});
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

  handleDrawingTool = (tool) => {
    this.setState({openBrushDialog: true});
  }

  handleSubmitDrawing = (base64) => {
    let editorState = this.state.editorState;
    let selectionState = editorState.getSelection();
    let anchorKey = selectionState.getAnchorKey();
    let currContent = editorState.getCurrentContent();
    var currentContentBlock = currContent.getBlockForKey(anchorKey);
    if (currentContentBlock.getType() === 'atomic') {
      toast.error(<SelectionImageMsg />);
      return;
    }

    const newEditorState = this.insertImage(this.state.editorState, base64);
    this.onChange(newEditorState);
    if (!this.state.firstImageInserted) {
      toast.info(<ResizeImageMsg />)
      this.setState({firstImageInserted: true});
    }
  }

  handleImageTool = (file) => {
    let editorState = this.state.editorState;
    let selectionState = editorState.getSelection();
    let anchorKey = selectionState.getAnchorKey();
    let currContent = editorState.getCurrentContent();
    var currentContentBlock = currContent.getBlockForKey(anchorKey);
    if (currentContentBlock.getType() === 'atomic') {
      toast.error(<SelectionImageMsg />);
      return;
    }

    try {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const newEditorState = this.insertImage(editorState, reader.result);
        if (newEditorState) {
          this.onChange(newEditorState);
          if (!this.state.firstImageInserted) {
            toast.info(<ResizeImageMsg />)
            this.setState({firstImageInserted: true});
          }
        }
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
    const selection = editorState.getSelection();
    if (link === null) {
      this.onChange(EditorState.forceSelection(editorState, selection));
      return;
    }
    if (link === '') {
      this.onChange(EditorState.forceSelection(editorState, selection));
      toast.error(<NoVideoMsg />);
      return;
    }
    if (!Utils.isVideo(link)) {
      this.onChange(EditorState.forceSelection(editorState, selection));
      toast.error(<InvalidVideoMsg />);
      return;
    }
    const newEditorState = this.insertVideo(this.state.editorState, link);
    this.onChange(EditorState.forceSelection(newEditorState, selection));
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
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    this.setState({openLinkInputDialog: false});
    if (link === null) {
      this.onChange(EditorState.forceSelection(editorState, selection));
      return;
    }

    if (link === '') {
      let newEditorState = RichUtils.toggleLink(editorState, selection, null);
      this.onChange(EditorState.forceSelection(newEditorState, selection));
      toast.error(<NoLinkMsg />);
      return 'handled';
    }
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
    let newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    newEditorState = RichUtils.toggleLink(newEditorState, selection, entityKey);
    this.onChange(EditorState.forceSelection(newEditorState, selection));
  }

  closeDialogKeepSelection = (result) => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    this.onChange(EditorState.forceSelection(editorState, selection));
    result();
  }

  render() {
    if (this.state.status === STATE_LOADED) {
      return (
        <div>
          <div className="mobileMessageContainer">
            <div className="warningContainer" style={{textAlign: 'center'}}>
              <img className="centerIcons" src={"/images/404-icon-01.png"} />
              <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>We apologize for the inconveniece.</p>
              <p className="warningMessage">We are still working on a mobile version. Please access the website on a laptop or computer.</p>
            </div>
          </div>
          <div className="container desktopContainer">
            <EmptyCardDialog
              open={this.state.openEmptyCardDialog}
              close={() => {this.setState({openEmptyCardDialog: false})}}
              handleCancel={() => {this.setState({openEmptyCardDialog: false})}}
              handleAccept={() => {this.state.emptyCardCallback()}}
            />
            <TutorialDialog
              open={this.state.openTutorialDialog}
              close={() => {this.setState({openTutorialDialog: false})}}
            />
            <AddStampDialog
              open={this.state.openAddStampDialog}
              close={() => {this.setState({openAddStampDialog: false})}}
              confirmStamp={this.confirmStamp}
            />
            <AddPasswordDialog
              open={this.state.openAddPasswordDialog}
              close={() => {this.setState({openAddPasswordDialog: false})}}
              shareCard={this.shareCard}
            />
            <ShareDialog
              open={this.state.openShareDialog}
              close={() => {this.setState({openShareDialog: false})}}
              cardKey={this.state.cardKey}
              password={this.state.password}
            />
            <LinkInputDialog
              open={this.state.openLinkInputDialog}
              close={() => {this.closeDialogKeepSelection(() => {this.setState({openLinkInputDialog: false})})}}
              handleLinkTool={this.handleLinkTool}
              handleVideoTool={this.handleVideoTool}
              currLinkTool={this.state.currLinkTool}
            />
            <BrushDialog
              open={this.state.openBrushDialog}
              close={() => {this.setState({openBrushDialog: false})}}
              handleSubmit={this.handleSubmitDrawing}
              handleCancel={()=>{this.setState({openBrushDialog: false})}}
              bgColor={this.state.currBGColor}
            />
            <PreviewDialog
              open={this.state.openPreviewDialog}
              close={() => this.setState({openPreviewDialog: false})}
              titleEditorState={this.state.titleEditorState}
              editorState={this.state.editorState}
              bgColor={this.state.currBGColor}
            />
            <p className="logo" style={{cursor: 'pointer'}} onMouseDown={() => {this.goHome()}}>Capsule</p>
            <button className="shareButton" style={{backgroundColor: this.state.currBGColor.value, float: 'right', marginTop: 30}} onMouseDown={(e) => {this.openAddStampDialog(e)}}>Send</button>
            <button className="previewButton" style={{backgroundColor: this.state.currBGColor.value, float: 'right' , marginTop: 30}} onMouseDown={(e) => {this.openPreview(e)}}>Preview</button>
            <button className="tutorialButton" style={{backgroundColor: this.state.currBGColor.value, float: 'right' , marginTop: 30}} onMouseDown={(e) => {this.openTutorialDialog(e)}}>Tutorial</button>
            <div style={{marginTop: 10}}></div>
            <Sticky className="stickyHeader">
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
                  handleDrawingTool={this.handleDrawingTool}
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
                placeholder={this.state.titlePlaceholder}
                editorState={this.state.titleEditorState}
                onChange={this.onTitleChange}
                onBlur={() => {this.setState({titleOnFocus: false})}}
                onFocus={() => {this.setState({titleOnFocus: true})}}
                keyBindingFn={this.titleKeyBindingFn}
                handleKeyCommand={this.handleTitleKeyCommand}
                handleDrop={() => 'handled'}
                blockStyleFn={Utils.getBlockStyle}
                customStyleMap={{...textColorStyleMap, ...fontStyleMap }}
                plugins={titlePlugins}
              />
            </div>
            <div id="editor" className="contentTextArea mainFGColor" style={{fontFamily: this.state.currFont.value, fontSize: this.state.defaultTextSize.value}}>
              <Editor
                placeholder={this.state.bodyPlaceholder}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onBlur={() => {this.setState({bodyOnFocus: false})}}
                onFocus={() => {this.setState({bodyOnFocus: true})}}
                keyBindingFn={this.myKeyBindingFn}
                onChange={this.onChange}
                blockStyleFn={Utils.getBlockStyle}
                handleDrop={() => 'handled'}
                ref="editor"
                plugins={plugins}
                customStyleMap={{...textColorStyleMap, ...highlightColorStyleMap, ...fontStyleMap, ...textSizeStyleMap }}
              />
              <EmojiSuggestions />
            </div>
            <AlignmentTool />
            <ScrollToTop />
          </div>
        </div>
      )
    } else if (this.state.status === STATE_REDIRECTHOME) {
      return (
        <Redirect push to="/" />
      )
    } else {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <div style={{width: "10%", margin: "0px auto", display: 'block'}}>
              <ReactLoading type={"bubbles"} color="#39b287" height={'100%'} width={'100%'} />
            </div>
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Prepare to write a beautiful letter!</p>
          </div>
        </div>
      )
    }
  }
}

export default EditorHome;
