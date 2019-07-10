import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class NewCardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {}
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
          <div className="dialogContent">
            <p className="tutorialTitle">{"Are you sure you want to delete your card?"}</p>
            <DialogContent>
              <ul className="termsListContainer">
                <li className="termsListItem">All content will be deleted.</li>
                <li className="termsListItem">None of the information written will be stored anywhere.</li>
                <li className="termsListItem">This action is irreversible.</li>
              </ul>
            </DialogContent>
          </div>
          <DialogActions>
            <div className="declineButton" onMouseDown={this.props.handleCancelNewCard}>
              <p>No</p>
            </div>
            <div className="dialogButton" onMouseDown={this.props.handleAcceptNewCard}>
              <p>Yes</p>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default NewCardDialog;
