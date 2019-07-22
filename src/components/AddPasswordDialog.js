import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import ReactLoading from 'react-loading';

// const password = require('secure-random-password');
const srs = require('secure-random-string');
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const maxPasswordLength = 10;
const minPasswordLength = 5;

class AddPasswordDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPassword: "",
      sharing: false,
    }
  }

  generatePassword = (e) => {
    e.preventDefault();
    const pw = srs({length: Math.floor(Math.random() * (maxPasswordLength - minPasswordLength) + minPasswordLength), alphanumeric: true});
    this.setState({currPassword: pw});
  }

  confirmPassword = (e) => {
    e.preventDefault();
    if (this.state.currPassword.length < minPasswordLength || this.state.currPassword.length > maxPasswordLength) {
      return;
    }
    this.setState({sharing: true});
    this.props.shareCard(this.state.currPassword, () => {this.setState({sharing: false, currPassword: ""})});
  }

  closeDialog = () => {
    this.setState({sharing: false, currPassword: ""});
    this.props.close();
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        TransitionComponent={Transition}
        onClose={this.closeDialog}
        fullWidth={true}
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            backgroundColor: '#3e3e3e',
          },
        }}
      >
        <div className="dialogContent">
          {
            this.state.sharing ? (
              <div>
                <div style={{width: "10%", margin: "0px auto", display: 'block'}}>
                  <ReactLoading type={"bubbles"} color="#39b287" height={'100%'} width={'100%'} />
                </div>
                <p className="warningMessage" style={{textAlign: 'center', color: "#39b287"}}>Preparing your card.</p>
              </div>
            ) : (
              <div>
                <p className="tutorialTitle" style={{marginBottom: 10}}>{"Protect your card."}</p>
                <p className="dialogText">This password will be embedded with the link.</p>
                <form onSubmit={(e) => {this.confirmPassword(e)}}>
                  <input
                    className="formInput"
                    value={this.state.currPassword}
                    onChange={(e) => {this.setState({currPassword: e.target.value})}}
                    spellCheck="false"
                    autoFocus
                    type="text"
                    placeholder="Password"
                  />
                  {
                    ((this.state.currPassword.length < minPasswordLength || this.state.currPassword.length > maxPasswordLength) && this.state.currPassword !== "") ? (
                      <p className="passwordIncorrectMsg" style={{height: 5}}>{"Please keep passwords to " + minPasswordLength + "-" + maxPasswordLength + " characters in length."}</p>
                    ) : (
                      this.state.currPassword !== "" && <p className="passwordIncorrectMsg" style={{height: 5, color: "#39b287"}}>{"Valid password!"}</p>
                    )
                  }
                  <div className="dialogButton" style={{width: 170, marginTop: 15, marginRight: 10, float: 'left'}} onMouseDown={(e) => this.generatePassword(e)}>
                    <p>Generate Password</p>
                  </div>
                  {
                    this.state.currPassword === "" ? (
                      <input disabled className="inputSubmitButtonInactive" style={{marginTop: 15, float: 'left'}} type="submit" value="Confirm"/>
                    ) : (
                      <input className="inputSubmitButton" style={{marginTop: 15, float: 'left'}} type="submit" value="Confirm"/>
                    )
                  }
                </form>
              </div>
            )
          }
        </div>
      </Dialog>
    )
  }
}

export default AddPasswordDialog;
