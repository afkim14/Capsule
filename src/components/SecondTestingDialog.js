import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Link} from 'react-router-dom';
import Utils from '../constants/utils';

const BASE_URL = Utils.getBaseURL();
class FirstStep extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Hello again!"}</p>
        <span className="dialogText">Welcome to the second version of Capsule. The major changes are delineated <a className="link" onClick={() => {Utils.openInNewTab(BASE_URL + "/cards/-LkMsxveZ27iTHdUQ4Nc/password")}}>here</a>. Please check them out since they are based on the feedback received.</span>
        <div className="dialogButton" style={{float: 'right', marginTop: 40}} onMouseDown={this.props.nextTutorialStep}>
          <p>Next</p>
        </div>
        <div style={{clear: 'both'}}/>
      </div>
    )
  }
}

class SecondStep extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"New task."}</p>
        <p className="dialogText">Your goal is to write another Capsule card to the developer of the application. This time, however, I would like to hear your thoughts on specific features and design elements of Capsule.</p>
        <div className="dialogButton" style={{float: 'left', marginTop: 10}} onMouseDown={this.props.prevTutorialStep}>
          <p>Prev</p>
        </div>
        <div className="dialogButton" style={{float: 'right', marginTop: 10}} onMouseDown={this.props.nextTutorialStep}>
          <p>Next</p>
        </div>
        <div style={{clear: 'both'}}/>
      </div>
    )
  }
}

class ThirdStep extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"The Questions."}</p>
        <ul className="dialogText">
          <li>What are your thoughts on the new home page?</li>
          <li>Do you like having many font options? Is this better than having only one?</li>
          <li>What is the application missing that deters it from being used often?</li>
        </ul>
        <p className="dialogText">Please feel free to continue pointing out bugs, likes, and dislikes even if they are not relevant to the questions above!</p>
        <div className="dialogButton" style={{float: 'left', marginTop: 20}} onMouseDown={this.props.prevTutorialStep}>
          <p>Prev</p>
        </div>
        <div className="dialogButton" style={{float: 'right', marginTop: 20}} onMouseDown={this.props.nextTutorialStep}>
          <p>Next</p>
        </div>
        <div style={{clear: 'both'}}/>
      </div>
    )
  }
}

class FourthStep extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Final Notes."}</p>
        <div style={{marginTop: 10}} />
        <span className="dialogText" style={{display: 'block'}}>As mentioned last time, if you have further content or design suggestions, feel free to check out the <Link className="link" to="/collaborate" target="_blank">Collaborate</Link> section of the website where you can submit feedback at any time. Thank you once again!</span>
        <div className="dialogButton" style={{float: 'left', marginTop: 30}} onMouseDown={this.props.prevTutorialStep}>
          <p>Prev</p>
        </div>
        <div className="dialogButton" style={{float: 'right', marginTop: 30}} onMouseDown={this.props.finishTestingInstructions}>
          <p>Finish</p>
        </div>
        <div style={{clear: 'both'}}/>
      </div>
    )
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class SecondTestingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currStepIndex: 0
    }
  }

  prevTutorialStep = () => {
    this.setState({currStepIndex: (this.state.currStepIndex - 1) % 4});
  }

  nextTutorialStep = () => {
    this.setState({currStepIndex: (this.state.currStepIndex + 1) % 4});
  }

  closeTestingDialog = () => {
    this.setState({currStepIndex: 0});
    this.props.close();
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          disableBackdropClick
          TransitionComponent={Transition}
          onClose={this.closeTestingDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              backgroundColor: '#3e3e3e',
            },
          }}
        >
          {this.state.currStepIndex == 0 && <FirstStep nextTutorialStep={this.nextTutorialStep} />}
          {this.state.currStepIndex == 1 && <SecondStep nextTutorialStep={this.nextTutorialStep} prevTutorialStep={this.prevTutorialStep} />}
          {this.state.currStepIndex == 2 && <ThirdStep nextTutorialStep={this.nextTutorialStep} prevTutorialStep={this.prevTutorialStep} />}
          {this.state.currStepIndex == 3 && <FourthStep prevTutorialStep={this.prevTutorialStep} finishTestingInstructions={this.closeTestingDialog} />}
        </Dialog>
      </div>
    )
  }
}

export default SecondTestingDialog;
