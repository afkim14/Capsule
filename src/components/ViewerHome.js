import React, { Component } from 'react';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import PasswordDialog from './PasswordDialog';
import { textColorStyleMap, highlightColorStyleMap } from '../constants/colors';
import { fontStyleMap } from '../constants/fonts';
import { textSizeStyleMap } from '../constants/textSizes';
import firebase from '../firebaseConfig';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createUnderlinePlugin from "../plugins/underlinePlugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';
import linkPlugin from '../plugins/linkPlugin';
import 'draft-js/dist/Draft.css';
import 'draft-js-image-plugin/lib/plugin.css';
import { Link} from 'react-router-dom'

const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(
  resizeablePlugin.decorator,
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
  videoPlugin
];

const STATE_LOADING = 'loading';
const STATE_AUTH = 'authentication';
const STATE_FAILED = 'failed';
const STATE_LOADED = 'loaded';
const INCORRECT_CARDID = 'incorrectID';

class ViewerHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      status: STATE_LOADING,
      title: '',
      editorState: null,
      openPasswordDialog: true,
      cardData: {}
    }

    this.onChange = (editorState) => this.setState({editorState});
  }

  componentDidMount() {
    // read data from database
    let url = window.location.pathname;
    let cardId = url.split("/")[2];
    try {
      firebase.database().ref(cardId).once('value', (snapshot) => {
        const pulledData = snapshot.val();
        if (pulledData) {
          this.setState({cardData: pulledData, status: STATE_AUTH});
        } else {
          this.setState({status: INCORRECT_CARDID});
        }
      });
    } catch (err) {
      this.setState({status: INCORRECT_CARDID})
      console.log(err);
    }
  }

  handleCorrectPassword = () => {
    const contentState = convertFromRaw( JSON.parse( this.state.cardData['data'] ) );
    this.setState({
      editorState: EditorState.createWithContent(contentState),
      title: this.state.cardData['title'],
      openPasswordDialog: false,
      status: STATE_LOADED
    });
  }

  printCard = () => {

  }

  shareCard = () => {

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
    if (this.state.status == STATE_LOADED) {
      return (
        <div className="container">
          <div className="navbar">
            <Link to="/">
              <button className="newCardButton mainBGColor">New Card</button>
            </Link>
            <button className="tutorialButton mainBGColor" onMouseDown={() => {this.printCard()}}>Print</button>
            <button className="shareButton mainBGColor" onMouseDown={() => {this.shareCard()}}>Share</button>
          </div>
          <div style={{clear: 'both'}}/>
          <p className="titleTextArea mainFGColor mainBGColor">{this.state.title}</p>
          <div id="editor" className="contentTextArea mainFGColor">
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              ref="editor"
              readOnly={true}
              blockStyleFn={this.getBlockStyle}
              customStyleMap={{...textColorStyleMap, ...highlightColorStyleMap, ...fontStyleMap, ...textSizeStyleMap }}
              plugins={plugins}
            />
          </div>
        </div>
      )
    } else if (this.state.status == STATE_AUTH) {
      return (
        <PasswordDialog
          open={this.state.openPasswordDialog}
          close={() => {this.setState({status: STATE_FAILED})}}
          password={this.state.cardData['password']}
          handleCorrectPassword={this.handleCorrectPassword}
        />
      )
    } else if (this.state.status == STATE_FAILED) {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <img className="centerIcons" src={"../images/password-icon-01.png"} />
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
    } else if (this.state.status == INCORRECT_CARDID) {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <img className="centerIcons" src={"../images/sad-icon-01.png"} />
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Card could not be found.</p>
            <p className="warningMessage mainFGColor mainBGColor">Please check the card link. It should look something like this:</p>
            <a className="link" style={{cursor: 'text'}}>https://appname.com/cards/-LjKneE4dVD</a>
            <Link style={{textDecoration: 'none'}} to={"/"}>
              <div className="dialogButton" style={{margin: '0px auto', marginTop: 30}}>
                <p>Go Home</p>
              </div>
            </Link>
          </div>
        </div>
      )
    } else if (this.state.status == STATE_LOADING) {
      return (
        <div className="container" style={{textAlign: 'center'}}>
          <div className="warningContainer">
            <img className="centerIcons" src={"../images/letter-icon-01.png"} />
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
