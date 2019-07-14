import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const password = require('secure-random-password');
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AddPasswordDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPassword: "",
    }
  }

  generatePassword = (e) => {
    e.preventDefault();
    const maxPasswordLength = 20;
    const minPasswordLength = 10;
    const pw = password.randomPassword({length: Math.floor(Math.random() * (maxPasswordLength - minPasswordLength) + minPasswordLength)});
    this.setState({currPassword: pw});
  }

  confirmPassword = (e) => {
    e.preventDefault();
    this.props.close();
    this.props.openShareDialog(this.state.currPassword);
  }

  closeDialog = () => {
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
          <p className="tutorialTitle" style={{marginBottom: 10}}>{"Protect your card."}</p>
          <p className="dialogHeader">Password</p>
          <form onSubmit={(e) => {this.confirmPassword(e)}}>
            <input
              className="formInput"
              value={this.state.currPassword}
              onChange={(e) => {this.setState({currPassword: e.target.value})}}
              spellCheck="false"
              type="text"
              placeholder="Password"
            />
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
      </Dialog>
    )
  }
}

export default AddPasswordDialog;
