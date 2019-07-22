import React, { Component } from 'react';
import { Link} from 'react-router-dom'
import firebase from 'firebase';
import {ErrorSendingFeedback, IncorrectHexColor} from '../constants/notifications';
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import {GENERAL, CARDCOLOR, TEXTCOLOR, STICKERS, FONT, FeedbackOptions} from '../constants/feedback';
import autosize from 'autosize';

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

class CollaborateHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currSelectedOption: GENERAL,
      currSender: "",
      currText: "",
      feedbackSubmitted: false,
      queueLength: 0
    }
  }

  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
    firebase.database().ref("/Constants/").once('value', (snapshot) => {
      const pulledData = snapshot.val();
      if (pulledData) {
        this.setState({queueLength: pulledData["numSuggestions"]});
      }
    });
  }

  handleSubmitFeedback = () => {
    if (this.state.currSelectedOption === CARDCOLOR || this.state.currSelectedOption === TEXTCOLOR) {
      if (!this.validHexColor(this.state.currText)) {
        toast.error(<IncorrectHexColor />);
        return;
      }
    }

    const newFeedback = {
      sender: this.state.currSender,
      feedback: this.state.currText,
      date: new Date()
    }

    firebase.app().database().ref('/' + this.state.currSelectedOption.replace(" ", "") + "Feedback" + '/').push({
      ...newFeedback
    }).then((data) => {
      firebase.database().ref('/Constants/').update({numSuggestions: this.state.queueLength + 1}).then((data) => {
        this.setState({feedbackSubmitted: true});
      });
    }).catch((error) => {
      toast.error(<ErrorSendingFeedback />);
    });
  }

  validHexColor = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  }

  getCurrentHexColor = () => {
    if (this.validHexColor(this.state.currText)) {
      return this.state.currText;
    }
    return "#cecece";
  }

  render() {
    return (
      <div className="container nonEditorContainer">
        <Link style={{textDecoration: 'none'}} to="/">
          <p className="logo">Capsule</p>
        </Link>
        <div style={{clear: 'both'}}/>
        <p className="sectionHeader">Collaborate</p>
        <p className="logoSubtext" style={{lineHeight: "180%", fontSize: 18}}>Help Capsule improve by providing feedback and suggestions. Suggestions can range from new styling options to overall criticism of Capsule. Styling options can range from new card background colors, sticker sets, fonts, and more!</p>
        {
          this.state.feedbackSubmitted ? (
            <div style={{textAlign: 'center'}}>
              <img className="centerIcons" style={{marginTop: 50}} src={"/images/feedback-01.png"} />
              <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Thank you for your feedback.</p>
              <p className="warningMessage">There are currently {this.state.queueLength} suggestions in the queue.</p>
            </div>
          ) : (
            <div>
              <div className="homeButtonContainer">
                {
                  FeedbackOptions.map((o, i) => {
                    return (
                      <div key={i} className={this.state.currSelectedOption === o ? "dialogButtonSelected" : "dialogButton"} style={{float: 'left', marginTop: 10, marginRight: 20}} onMouseDown={()=> {this.setState({currSelectedOption: o, currText: ""})}}>
                        <p>{o}</p>
                      </div>
                    )
                  })
                }
              </div>
              <input
                className="emailFormInput"
                value={this.state.currSender}
                onChange={(e) => {this.setState({currSender: e.target.value})}}
                spellCheck="false"
                type="text"
                placeholder="Email"
              />
              {
                this.state.currSelectedOption === GENERAL && (
                  <textarea className="generalFeedbackTextArea" spellCheck="false" placeholder="Please tell us what you think ..." value={this.state.currText} onChange={(e) => {this.setState({currText: e.target.value})}}/>
                )
              }
              {
                this.state.currSelectedOption === STICKERS && (
                  <div>
                    <input className="emailFormInput"
                      value={this.state.currText}
                      onChange={(e) => {this.setState({currText: e.target.value})}}
                      spellCheck="false"
                      type="text"
                      placeholder="Sticker URL"
                    />
                    <div style={{marginTop: 10}}/>
                    <span className="inputExtraInfo">We just need a link to see the stickers. We are working on handling file uploads.</span>
                    <div style={{marginTop: 20}}/>
                  </div>
                )
              }
              {
                (this.state.currSelectedOption === CARDCOLOR || this.state.currSelectedOption === TEXTCOLOR) && (
                  <div>
                    <input className="emailFormInput"
                      value={this.state.currText}
                      style={{color: this.getCurrentHexColor()}}
                      onChange={(e) => {this.setState({currText: e.target.value})}}
                      spellCheck="false"
                      type="text"
                      placeholder="Color Hexcode (ex. #EB2F39)"
                    />
                    <div style={{marginTop: 10}}/>
                    <span className="inputExtraInfo">Hexcodes help us know the exact color you want. For help, visit: <a className="link" href="https://color.adobe.com/create" target="_blank">Adobe Color</a>.</span>
                    <div style={{marginTop: 20}}/>
                  </div>
                )
              }
              {
                this.state.currSelectedOption === FONT && (
                  <div>
                    <input className="emailFormInput"
                      value={this.state.currText}
                      onChange={(e) => {this.setState({currText: e.target.value})}}
                      spellCheck="false"
                      type="text"
                      placeholder="Google Font URL"
                    />
                    <div style={{marginTop: 10}}/>
                    <span className="inputExtraInfo">Capsule makes use of Google Fonts. For help, visit: <a className="link" href="https://fonts.google.com/" target="_blank">Google Fonts</a>.</span>
                    <div style={{marginTop: 20}}/>
                  </div>
                )
              }
              {
                this.state.currSender !== "" && this.state.currText !== "" ? (
                  <div
                    className="dialogButton"
                    style={{marginTop: 20, marginBottom: 40}}
                    onMouseDown={this.handleSubmitFeedback}>
                    <p>Submit</p>
                  </div>
                ) : (
                  <div
                    className="dialogButton"
                    style={{marginTop: 20, marginBottom: 40, border: "2px solid #333333", pointerEvents: 'none'}}>
                    <p style={{color: "#333333"}}>Submit</p>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}

export default CollaborateHome;
