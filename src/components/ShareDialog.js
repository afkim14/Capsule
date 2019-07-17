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
import {
  FacebookShareButton,
  EmailShareButton,
  EmailIcon
} from 'react-share';

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
            <CopyToClipboard text={BASE_URL + this.props.cardKey} onCopy={() => this.setState({urlCopied: true, pwCopied: false})}>
              <div className="linkContainer">
                <p className="link" style={{color: "#3e3e3e"}}>{BASE_URL + this.props.cardKey}</p>
              </div>
            </CopyToClipboard>
            {
              this.state.urlCopied ? (
                <p className="copiedMessage">URL copied.</p>
              ) : (
                <p className="copiedMessage" style={{color: "#777777"}}>Click to copy.</p>
              )
            }
            <p className="dialogHeader">Password</p>
            <CopyToClipboard text={this.props.password} onCopy={() => this.setState({pwCopied: true, urlCopied: false})}>
            <div className="passwordContainer">
              <p className="password">{this.props.password}</p>
            </div>
            </CopyToClipboard>
            {
              this.state.pwCopied ? (
                <p className="copiedMessage">Password copied.</p>
              ) : (
                <p className="copiedMessage" style={{color: "#777777"}}>Click to copy.</p>
              )
            }
            <div style={{clear: 'both'}}/>
            {/*
            <FacebookShareButton
              style={{outline: 'none'}}
              quote={"Hey, I wrote you a Capsule! The password is: " + this.props.password + "."}
              url={BASE_URL + this.props.cardKey}
            >
              <div className="dialogButton" style={{float: 'left', marginRight: 10}}>
                <p className="shareSocialMediaText">Facebook</p>
              </div>
            </FacebookShareButton>
            */}
            <div style={{height: 2, backgroundColor: "#333333", marginTop: 20, marginBottom: 20}} />
            <EmailShareButton
              style={{outline: 'none', margin: "0px auto", display: 'block', width: '20%'}}
              subject={"A New Capsule Has Arrived!"}
              body={"Hey, I wrote you a Capsule! The password is: " + this.props.password + ".\n\n"}
              url={BASE_URL + this.props.cardKey}
            >
              <div className="shareSocialMediaButton">
                <EmailIcon size={40} round={true} />
              </div>
            </EmailShareButton>
            <p style={{textAlign: 'center', color: "#cecece", fontSize: 16}}>andreskim2018@u.northwestern.edu</p>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default ShareDialog;
