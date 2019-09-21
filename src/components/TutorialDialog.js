import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import ReactPlayer from 'react-player'
import ReactLoading from 'react-loading';

const hiddenDivStyle = {
  display: 'none',
  visibility: 'hidden'
}

class FirstStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoLoaded: false
    }
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Write and style."}</p>
        <div className="tutorialVideoContainer">
          <div style={this.state.videoLoaded ? {} : {display: 'none', visibility: 'hidden'}}>
            <ReactPlayer url='/videos/text-styling.mp4' loop playing controls={false} width={"100%"} onReady={() => {this.setState({videoLoaded: true})}} />
          </div>
          <div>
            <div style={{width: "10%", margin: "0px auto", display: 'block', marginTop: 100}}>
              <ReactLoading type={"bubbles"} color="#39b287" height={'100%'} width={'100%'} />
            </div>
            <p className="warningMessage" style={{textAlign: 'center', color: "#39b287"}}>Loading video.</p>
          </div>
        </div>
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
    this.state = {
      videoLoaded: false
    }
  }
  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Show memorable photos and videos."}</p>
        <div className="tutorialVideoContainer">
          <div style={this.state.videoLoaded ? {} : {display: 'none', visibility: 'hidden'}}>
            <ReactPlayer url='/videos/insert-image.mp4' loop playing controls={false} width={"100%"} height={'100%'} onReady={() => {this.setState({videoLoaded: true})}} />
          </div>
          <div>
            <div style={{width: "10%", margin: "0px auto", display: 'block', marginTop: 100}}>
              <ReactLoading type={"bubbles"} color="#39b287" height={'100%'} width={'100%'} />
            </div>
            <p className="warningMessage" style={{textAlign: 'center', color: "#39b287"}}>Loading video.</p>
          </div>
        </div>
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
    this.state = {
      videoLoaded: false
    }
  }

  render() {
    return (
      <div className="dialogContent">
        <p className="tutorialTitle">{"Send your card."}</p>
        <div className="tutorialVideoContainer">
          <div style={this.state.videoLoaded ? {} : {display: 'none', visibility: 'hidden'}}>
            <ReactPlayer url='/videos/share.mp4' loop playing controls={false} width={"90%"} onReady={() => {this.setState({videoLoaded: true})}} />
          </div>
          <div>
            <div style={{width: "10%", margin: "0px auto", display: 'block', marginTop: 100}}>
              <ReactLoading type={"bubbles"} color="#39b287" height={'100%'} width={'100%'} />
            </div>
            <p className="warningMessage" style={{textAlign: 'center', color: "#39b287"}}>Loading video.</p>
          </div>
        </div>
        <div className="dialogButton" style={{float: 'left', marginTop: 10}} onMouseDown={this.props.prevTutorialStep}>
          <p>Prev</p>
        </div>
        <div className="dialogButton" style={{float: 'right', marginTop: 10}} onMouseDown={this.props.finishTutorial}>
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
