import React, { Component } from 'react';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import Utils from '../constants/utils';
import PasswordDialog from './PasswordDialog';
import ShareDialog from './ShareDialog';
import TutorialDialog from './TutorialDialog';
import { textColorStyleMap, highlightColorStyleMap } from '../constants/colors';
import { FONTS, fontStyleMap } from '../constants/fonts';
import { textSizeStyleMap } from '../constants/textSizes';
import firebase from '../firebaseConfig';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createUnderlinePlugin from "../plugins/underlinePlugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';
import linkPlugin from '../plugins/linkPlugin';
import html2canvas from 'html2canvas';
import 'draft-js/dist/Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import { Link} from 'react-router-dom';
import ReactLoading from 'react-loading';
import Fade from 'react-reveal/Fade';
import Sticky from 'react-sticky-el';
import ScrollToTop from './ScrollToTop';

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

const STATE_LOADING = 'loading';
const STATE_AUTH = 'authentication';
const STATE_FAILED = 'failed';
const STATE_COVER = 'cover';
const STATE_LOADED = 'loaded';
const INCORRECT_CARDID = 'incorrectID';

class ViewerHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      status: STATE_LOADING,
      titleEditorState: null,
      editorState: null,
      openPasswordDialog: true,
      cardData: {},
      currBGColor: null,
      currFont: FONTS[0],
      openShareDialog: false,
      openTutorialDialog: false,
      cardKey: null,
      password: null,
      currStamp: null,
      cardImageURL: '/images/card-01.png'
    }

    this.onTitleChange = (titleEditorState) => this.setState({titleEditorState});
    this.onChange = (editorState) => this.setState({editorState});
  }

  componentDidMount() {
    // read data from database
    this.checkURLValidity();
  }

  openTutorialDialog = (e) => {
    e.preventDefault();
    this.setState({openTutorialDialog: true});
  }

  checkURLValidity = () => {
    if ((window.location.pathname.match(/\//g)||[]).length > 2) {
      let tokens = window.location.pathname.split("/");
      let possiblePassword = tokens[tokens.length-1];
      let possibleKey = tokens[tokens.length-2];
      try {
        firebase.database().ref("/Cards/" + possibleKey).once('value', (snapshot) => {
          const pulledData = snapshot.val();
          if (pulledData) {
            if (pulledData['password'] === possiblePassword) {
              this.setState({cardData: pulledData, cardKey: possibleKey});
              this.handleCorrectPassword();
            } else {
              this.setState({status: INCORRECT_CARDID});
            }
          } else {
            this.setState({status: INCORRECT_CARDID});
          }
        });
      } catch (err) {
        this.setState({status: INCORRECT_CARDID})
        console.log(err);
      }
    } else {
      let tokens = window.location.pathname.split("/");
      let possibleKey = tokens[tokens.length-1];
      try {
        firebase.database().ref("/Cards/" + possibleKey).once('value', (snapshot) => {
          const pulledData = snapshot.val();
          if (pulledData) {
            this.setState({cardData: pulledData, status: STATE_AUTH, cardKey: possibleKey});
          } else {
            this.setState({status: INCORRECT_CARDID});
          }
        });
      } catch (err) {
        this.setState({status: INCORRECT_CARDID})
        console.log(err);
      }
    }
  }

  handleCorrectPassword = () => {
    const titleContentState = convertFromRaw( JSON.parse( this.state.cardData['title'] ) )
    const contentState = convertFromRaw( JSON.parse( this.state.cardData['data'] ) );
    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: " + this.state.cardData['bgColor'].value + " !important;");
    this.setState({
      editorState: EditorState.createWithContent(contentState),
      titleEditorState: EditorState.createWithContent(titleContentState),
      openPasswordDialog: false,
      status: STATE_COVER,
      currBGColor: this.state.cardData['bgColor'],
      // currFont: this.state.cardData['font'],
      password: this.state.cardData['password'],
      currStamp: this.state.cardData['stampURL'] ? this.state.cardData['stampURL'] : '/stamps/stamp-2-01.png'
    });
  }

  saveCard = () => {

  }

  shareCard = () => {
    this.setState({openShareDialog: true});
  }

  getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'align-left':
        return 'align-left';
      case 'align-center':
        return 'align-center';
      case 'align-right':
        return 'align-right';
      case 'align-justify':
        return 'align-justify';
      default:
        return null;
    }
  }

  render() {
    if (this.state.status === STATE_LOADED) {
      return (
        <div className="container">
          <ShareDialog
            open={this.state.openShareDialog}
            close={() => {this.setState({openShareDialog: false})}}
            cardKey={this.state.cardKey}
            password={this.state.password}
          />
          {/*
          <TutorialDialog
            open={this.state.openTutorialDialog}
            close={() => {this.setState({openTutorialDialog: false})}}
          />
          */}
          <Link style={{textDecoration: 'none'}} to="/">
            <p className="logo">Capsule</p>
          </Link>
          <button className="shareButton mainBGColor" style={{backgroundColor: this.state.currBGColor.value, float: 'right', marginTop: 30}}  onMouseDown={() => {this.shareCard()}}>Share</button>
          <Link to="/editor">
            <button style={{backgroundColor: this.state.currBGColor.value, float: 'right', marginTop: 30}} className="newCardButton mainBGColor">New Card</button>
          </Link>
          <div style={{marginTop: 40, clear: 'both'}}></div>
          <div className="titleTextArea mainFGColor" style={{fontFamily: this.state.currFont.value}}>
            <Editor
              editorState={this.state.titleEditorState}
              onChange={this.onTitleChange}
              readOnly={true}
              blockStyleFn={Utils.getBlockStyle}
              customStyleMap={{...textColorStyleMap, ...fontStyleMap }}
            />
          </div>
          <div id="editor" className="contentTextArea mainFGColor" style={{fontFamily: this.state.currFont.value}}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              ref="editor"
              readOnly={true}
              blockStyleFn={Utils.getBlockStyle}
              customStyleMap={{...textColorStyleMap, ...highlightColorStyleMap, ...fontStyleMap, ...textSizeStyleMap }}
              plugins={plugins}
            />
          </div>
          <ScrollToTop />
        </div>
      )
    } else if (this.state.status === STATE_AUTH) {
      return (
        <PasswordDialog
          open={this.state.openPasswordDialog}
          close={() => {this.setState({status: STATE_FAILED})}}
          password={this.state.cardData['password']}
          handleCorrectPassword={this.handleCorrectPassword}
        />
      )
    } else if (this.state.status === STATE_COVER) {
      return (
        <Fade left>
          <div className="cardImageContainer"
            style={{backgroundImage: `url(${this.state.cardImageURL})`}}
          >
            <div className="openCardContainer"
              onMouseEnter={() => {this.setState({cardImageURL: '/images/card-open-01.png'})}}
              onMouseLeave={() => {this.setState({cardImageURL: '/images/card-01.png'})}}
              onMouseDown={() => {this.setState({status: STATE_LOADED})}}
            />
            <img src={"/images/card-open-01.png"} style={{visibility: 'hidden', display: 'none'}}/>
            <img className="stampAnimation" src={this.state.currStamp}/>
            {/*<p className="warningMessage mainFGColor mainBGColor stampAnimationText" style={{color: "#39b287", fontWeight: 'bold'}}>Click stamp to open Capsule.</p>*/}
          </div>
        </Fade>
      )
    } else if (this.state.status === STATE_FAILED) {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <img className="centerIcons" src={"/images/password-icon-01.png"} />
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Forgot the password?</p>
            <p className="warningMessage">Please check with the person who sent you the letter.</p>
            <Link style={{textDecoration: 'none'}} to={"/"}>
              <div className="dialogButton" style={{margin: '0px auto', marginTop: 30}}>
                <p>Go Home</p>
              </div>
            </Link>
          </div>
        </div>
      )
    } else if (this.state.status === INCORRECT_CARDID) {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <img className="centerIcons" src={"/images/sad-icon-01.png"} />
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Card could not be found.</p>
            <p className="warningMessage mainFGColor mainBGColor">Please check the card link. It should look something like this:</p>
            <a className="link" style={{cursor: 'text'}}>projectcapsule.me/cards/-LjKneE4dVD/s3932jfd</a>
            <Link style={{textDecoration: 'none'}} to={"/"}>
              <div className="dialogButton" style={{margin: '0px auto', marginTop: 30}}>
                <p>Go Home</p>
              </div>
            </Link>
          </div>
        </div>
      )
    } else if (this.state.status === STATE_LOADING) {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <div style={{width: "10%", margin: "0px auto", display: 'block'}}>
              <ReactLoading type={"bubbles"} color="#39b287" height={'100%'} width={'100%'} />
            </div>
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Loading a beautiful card!</p>
          </div>
        </div>
      )
    }

    return (
      <div>
      </div>
    )
  }
}

export default ViewerHome;
