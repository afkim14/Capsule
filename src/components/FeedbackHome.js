import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {GENERAL, CARDCOLOR, TEXTCOLOR, STICKERS, FONT, FeedbackOptions} from '../constants/feedback';
import firebase from 'firebase';
import PasswordDialog from './PasswordDialog';

class FeedbackHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currSelectedOption: GENERAL,
      queueLength: 0,
      correctPassword: false,
      openPasswordDialog: true
    }
  }

  handleCorrectPassword = () => {
    this.loadData();
    this.setState({openPasswordDialog: false, correctPassword: true});
  }

  loadData = () => {
    FeedbackOptions.forEach((element) => {
      var key = element.replace(" ", "") + "Feedback";
      firebase.database().ref('/' + key + '/').once('value', (snapshot) => {
        const pulledData = snapshot.val();
        if (pulledData) {
          this.setState({[key]: pulledData});
        }
      });
    });

    firebase.database().ref("/Constants/").once('value', (snapshot) => {
      const pulledData = snapshot.val();
      if (pulledData) {
        this.setState({queueLength: pulledData["numSuggestions"]});
      }
    });
  }

  deleteFeedback = (key) => {
    firebase.database().ref(key).remove().then((data) => {
      firebase.database().ref('/Constants/').update({numSuggestions: this.state.queueLength - 1}).then((data) => {
        this.loadData();
      });
    }).catch((error) => {
      // console.log("Remove failed: " + error.message)
    });
  }

  render() {
    if (!this.state.correctPassword) {
      return (
        <PasswordDialog
          open={this.state.openPasswordDialog}
          close={() => {this.setState({correctPassword: false})}}
          password={"password"}
          handleCorrectPassword={this.handleCorrectPassword}
        />
      )
    } else {
      return (
        <div className="container" style={{width: "60%"}}>
          <div className="navbar" style={{marginBottom: 0}}>
            <Link style={{textDecoration: 'none'}} to="/">
              <div className="dialogButton">
                <p>Home</p>
              </div>
            </Link>
          </div>
          <div style={{clear: 'both', marginBottom: 30}}/>
          <div className="homeButtonContainer">
            {
              FeedbackOptions.map((o, i) => {
                return (
                  <div key={i} className={this.state.currSelectedOption === o ? "dialogButtonSelected" : "dialogButton"} style={{float: 'left', marginTop: 10, marginBottom: 30, marginRight: 20}} onMouseDown={()=> {this.setState({currSelectedOption: o, currText: ""})}}>
                    <p>{o}</p>
                  </div>
                )
              })
            }
          </div>
          {
            Object.keys(this.state).map((s, i) => {
              if (s === GENERAL.replace(" ", "") + "Feedback" && this.state.currSelectedOption === GENERAL) {
                return (
                  <div key={i}>
                    <p className="logo">{s}</p>
                    {
                      Object.keys(this.state[s]).map((e, i) => {
                        return (
                          <div className="feedbackContainer" key={i}>
                            <p className="feedbackSender">{this.state[s][e].sender}</p>
                            <p className="feedbackContent">{this.state[s][e].feedback}</p>
                            <div className="dialogButton" style={{marginTop: 10, width: 120}} onMouseDown={() => this.deleteFeedback("/" + s + "/" + e)}>
                              <p>Delete</p>
                            </div>
                            <div className="feedbackDivider"></div>
                          </div>
                        )
                      })
                    }
                    <div style={{clear: 'both'}}/>
                  </div>
                )
              } else if ((s === STICKERS.replace(" ", "") + "Feedback" && this.state.currSelectedOption === STICKERS) ||
                          (s === FONT.replace(" ", "") + "Feedback" && this.state.currSelectedOption === FONT)) {
                return (
                  <div key={i}>
                    <p className="logo">{s}</p>
                    {
                      Object.keys(this.state[s]).map((e, i) => {
                        return (
                          <div className="feedbackContainer" key={i}>
                            <p className="feedbackSender">{this.state[s][e].sender}</p>
                            <a className="link" href={this.state[s][e].feedback} target="_blank">{this.state[s][e].feedback}</a>
                            <div className="dialogButton" style={{marginTop: 10, width: 120}} onMouseDown={() => this.deleteFeedback("/" + s + "/" + e)}>
                              <p>Delete</p>
                            </div>
                            <div className="feedbackDivider"></div>
                          </div>
                        )
                      })
                    }
                    <div style={{clear: 'both'}}/>
                  </div>
                )
              } else if ((s === CARDCOLOR.replace(" ", "") + "Feedback" && this.state.currSelectedOption === CARDCOLOR) ||
                          (s === TEXTCOLOR.replace(" ", "") + "Feedback" && this.state.currSelectedOption === TEXTCOLOR)) {
                return (
                  <div key={i}>
                    <p className="logo">{s}</p>
                    {
                      Object.keys(this.state[s]).map((e, i) => {
                        return (
                          <div className="feedbackContainer" key={i}>
                            <p className="feedbackSender">{this.state[s][e].sender}</p>
                            <p className="feedbackContent" style={{color: this.state[s][e].feedback}}>{this.state[s][e].feedback}</p>
                            <div className="feedbackColorContainer" style={{backgroundColor: this.state[s][e].feedback}}></div>
                            <div className="dialogButton" style={{marginTop: 10, width: 120}} onMouseDown={() => this.deleteFeedback("/" + s + "/" + e)}>
                              <p>Delete</p>
                            </div>
                          </div>
                        )
                      })
                    }
                    <div style={{clear: 'both'}}/>
                  </div>
                )
              }
            })
          }
        </div>
      )
    }
  }
}

export default FeedbackHome;
