import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Link} from 'react-router-dom';

class FirstStep extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Welcome to Capsule."}</p>
        <p className="dialogText">Thank you for taking the time to test this application. Please feel free to be critical and pinpoint features that are counterintuitive, uncomfortable, or even useless. No hurt feelings!</p>
        <div className="dialogButton" style={{float: 'right', marginTop: 10}} onMouseDown={this.props.nextTutorialStep}>
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
        <p className="tutorialTitle">{"Your task."}</p>
        <p className="dialogText">Your goal is to write a Capsule card to the developer of the application delineating what you like, dislike, or wish Capsule would offer. Feel free to keep it short!</p>
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
        <p className="tutorialTitle">{"Share your card."}</p>
        <p className="dialogText">Please share the capsule card with Andres through Email. Other means of sharing have not been implemented. We apologize for the inconvenience!</p>
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
        <span className="dialogText" style={{display: 'block'}}>If you have further content or design suggestions, feel free to check out the <Link className="link" to="/collaborate">Collaborate</Link> section of the website where you can submit feedback at any time. Thank you once again!</span>
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

class TestingDialog extends Component {
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

export default TestingDialog;
