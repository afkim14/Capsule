import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

class FirstStep extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Write and style."}</p>
        <div>
          <video className="tutorialVideo" autoPlay loop>
            <source src={"./videos/text-styling.mp4"} type={"video/mp4"} />
          </video>
        </div>
        <div className="dialogButton" style={{float: 'right'}} onMouseDown={this.props.nextTutorialStep}>
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
        <p className="tutorialTitle">{"Show memorable photos and videos."}</p>
        <div>
          <video className="tutorialVideo" autoPlay loop>
            <source src={"./videos/insert-image.mp4"} type={"video/mp4"} />
          </video>
        </div>
        <div className="dialogButton" style={{float: 'left'}} onMouseDown={this.props.prevTutorialStep}>
          <p>Prev</p>
        </div>
        <div className="dialogButton" style={{float: 'right'}} onMouseDown={this.props.nextTutorialStep}>
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
        <p className="tutorialTitle">{"Send your card."}</p>
        <div>
          <video className="tutorialVideo" autoPlay loop>
            <source src={"./videos/insert-image.mp4"} type={"video/mp4"} />
          </video>
        </div>
        <div className="dialogButton" style={{float: 'left'}} onMouseDown={this.props.prevTutorialStep}>
          <p>Prev</p>
        </div>
        <div className="dialogButton" style={{float: 'right'}} onMouseDown={this.props.finishTutorial}>
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

class TutorialDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currStepIndex: 0
    }
  }

  prevTutorialStep = () => {
    this.setState({currStepIndex: (this.state.currStepIndex - 1) % 3});
  }

  nextTutorialStep = () => {
    this.setState({currStepIndex: (this.state.currStepIndex + 1) % 3});
  }

  closeTutorial = () => {
    this.setState({currStepIndex: 0});
    this.props.close();
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          onClose={this.closeTutorial}
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
          {this.state.currStepIndex == 2 && <ThirdStep prevTutorialStep={this.prevTutorialStep} finishTutorial={this.closeTutorial} />}
        </Dialog>
      </div>
    )
  }
}

export default TutorialDialog;
