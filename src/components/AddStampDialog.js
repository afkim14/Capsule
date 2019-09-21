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
import {STAMPS} from '../constants/stamps';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AddStampDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currStamp: null,
    }
  }

  confirmStamp = (e) => {
    e.preventDefault();
    this.setState({currStamp: true});
    this.props.confirmStamp(this.state.currStamp);
  }

  closeDialog = () => {
    this.setState({currStamp: null});
    this.props.close();
  }

  handleStampTool = (stamp, e) => {
    e.preventDefault();
    this.setState({currStamp: stamp});
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        TransitionComponent={Transition}
        onClose={this.closeDialog}
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
          <p className="tutorialTitle">Choose a stamp.</p>
          <p className="dialogText">This stamp will be shown on the cover of the card!</p>
          {
            STAMPS.map((s, i) => {
              return (
                this.state.currStamp === s ? (
                  <img alt={s.label} key={i} className="stampImageSelected" style={i === 0 ? {marginLeft: 0} : {}} src={s.src} />
                ) : (
                  <img alt={s.label} key={i} className="stampImage" style={i === 0 ? {marginLeft: 0} : {}} src={s.src} onMouseDown={(e) => {this.handleStampTool(s, e)}} />
                )
              )
            })
          }
          <div style={{clear: 'both'}}/>
          {
            this.state.currStamp === null ? (
              <div className="dialogButtonInactive" style={{float: 'left', marginTop: 20}}>
                <p>Select</p>
              </div>
            ) : (
              <div className="dialogButton" style={{float: 'left', marginTop: 20}} onMouseDown={(e) => {this.confirmStamp(e)}}>
                <p>Select</p>
              </div>
            )
          }
        </div>
      </Dialog>
    )
  }
}

export default AddStampDialog;
