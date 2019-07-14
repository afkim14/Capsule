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
import { Link } from 'react-router-dom'

const BASE_URL = Utils.getBaseURL() + "/cards/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ShareDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlCopied: false,
      pwCopied: false
    }
  }

  closeShare = () => {
    this.setState({urlCopied: false, pwCopied: false});
    this.props.close();
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          onClose={this.closeShare}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              backgroundColor: '#3e3e3e',
            },
          }}
        >
          <div className="dialogContent">
            <p className="tutorialTitle" style={{marginBottom: 10}}>{"Share your card."}</p>
            <p className="dialogHeader">Link</p>
            <Link to={"/cards/" + this.props.cardKey} target="_blank">
              <div className="linkContainer">
                <p className="link" style={{color: "#3e3e3e"}}>{BASE_URL + this.props.cardKey}</p>
              </div>
            </Link>
            <p className="dialogHeader">Password</p>
            <div className="passwordContainer">
              <p className="password">{this.props.password}</p>
            </div>
            <div style={{clear: 'both'}}/>
            {
              this.state.urlCopied ? (
                <div className="dialogButtonSelected" style={{marginTop: 15, marginRight: 10, float: 'left'}}>
                  <p>Copied</p>
                </div>
              ) : (
                <CopyToClipboard text={BASE_URL + this.props.cardKey} onCopy={() => this.setState({urlCopied: true, pwCopied: false})}>
                  <div className="dialogButton" style={{marginTop: 15, marginRight: 10, float: 'left'}}>
                    <p>Copy URL</p>
                  </div>
                </CopyToClipboard>
              )
            }
            {
              this.state.pwCopied ? (
                <div className="dialogButtonSelected" style={{width: 150, marginTop: 15, marginRight: 10, float: 'left'}}>
                  <p>Copied</p>
                </div>
              ) : (
                <CopyToClipboard text={this.props.password} onCopy={() => this.setState({pwCopied: true, urlCopied: false})}>
                  <div className="dialogButton" style={{width: 150, marginTop: 15, marginRight: 10, float: 'left'}}>
                    <p>Copy Password</p>
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
