import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Utils from '../constants/utils'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class PasswordDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPassword: '',
      incorrectPassword: false
    }
  }

  handleSubmitPassword = (e) => {
    e.preventDefault();
    this.state.currPassword === this.props.password ? this.props.handleCorrectPassword() : this.setState({incorrectPassword: true, currPassword: ''});
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          onClose={this.props.close}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              backgroundColor: '#3e3e3e',
            },
          }}
        >
          <div className="dialogContent" style={{textAlign: 'center'}}>
            {
              this.state.incorrectPassword && <p className="passwordIncorrectMsg">Incorrect password. Please try again.</p>
            }
            <form onSubmit={(e) => {this.handleSubmitPassword(e)}}>
              <input
                className="formInput"
                type="password"
                placeholder="Password"
                autoFocus
                spellCheck="false"
                value={this.state.currPassword}
                onChange={(e) => {this.setState({currPassword: e.target.value})}}
              />
              <input className="inputSubmitButton" style={{marginTop: 10}} type="submit" value="Submit"/>
            </form>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default PasswordDialog;
