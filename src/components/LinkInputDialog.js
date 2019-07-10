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

class LinkInputDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currLink: ''
    }
  }

  handleSubmitVideo = (e) => {
    e.preventDefault();
    this.setState({currLink: ''});
    this.props.handleVideoTool(this.state.currLink);
  }

  handleSubmitLink = (e) => {
    e.preventDefault();
    this.setState({currLink: ''});
    this.props.handleLinkTool(this.state.currLink);
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
            <form onSubmit={(e) => {this.props.currLinkTool === "link" ? this.handleSubmitLink(e) : this.handleSubmitVideo(e)}}>
              <input
                className="formInput"
                type="text"
                placeholder={this.props.currLinkTool === "link" ? "URL" : "Youtube or Video URL"}
                autoFocus
                spellCheck="false"
                value={this.state.currLink}
                onChange={(e) => {this.setState({currLink: e.target.value})}}
              />
              <input className="inputSubmitButton" type="submit" value="Submit"/>
            </form>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default LinkInputDialog;
