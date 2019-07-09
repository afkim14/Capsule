import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
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

class ShareDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlCopied: false,
    }
  }

  closeShare = () => {
    this.setState({urlCopied: false});
    this.props.close();
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.closeShare}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              backgroundColor: '#3e3e3e',
            },
          }}
        >
          <div className="dialogContent" style={{textAlign: 'center'}}>
            <p className="tutorialTitle" style={{marginBottom: 20}}>{"Share your card."}</p>
            <a className="link" onClick={() => {Utils.openInNewTab(this.props.shareLink)}}>{this.props.shareLink}</a>
            {
              this.state.urlCopied ? (
                <div className="dialogButtonSelected" style={{margin: '0px auto', marginTop: 30}}>
                  <p>Copied</p>
                </div>
              ) : (
                <CopyToClipboard text={this.props.shareLink} onCopy={() => this.setState({urlCopied: true})}>
                  <div className="dialogButton" style={{margin: '0px auto', marginTop: 30}}>
                    <p>Copy</p>
                  </div>
                </CopyToClipboard>
              )
            }
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ShareDialog;
