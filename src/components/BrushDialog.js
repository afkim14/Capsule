import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import SignatureCanvas from 'react-signature-canvas'
import { TEXT_COLORS } from '../constants/colors';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class BrushDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currTextColor: TEXT_COLORS[0]
    }
  }

  handleClear = () => {
    this.sigCanvas.clear();
  }

  handleTextColorChange = (color, e) => {
    e.preventDefault();
    this.setState({currTextColor: color});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.sigCanvas.isEmpty()) {
      this.props.handleSubmit( this.sigCanvas.getTrimmedCanvas().toDataURL() );
    }
    this.props.close();
  }

  render() {
    return (
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
          <p className="tutorialTitle">{"Draw your sketch."}</p>
          <div className="textColorsContainer" style={{marginTop: 10, width: "100%"}}>
            {
              TEXT_COLORS.map((c, i) => {
                return (
                  c.label === this.state.currTextColor.label ? (
                    <div key={i} className="colorBox" style={{backgroundColor: c.value, border: "2px solid #39b287", width: 16, height: 16}} onMouseDown={(e) => {this.handleTextColorChange(c, e)}}></div>
                  ) : (
                    <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseEnter={() => {this.setState({currHoverTextColor: c})}} onMouseLeave={() => {this.setState({currHoverTextColor: this.state.currTextColor})}} onMouseDown={(e) => {this.handleTextColorChange(c, e)}}></div>
                  )
                )
              })
            }
          </div>
          <SignatureCanvas
            penColor={this.state.currTextColor.value}
            ref={(ref) => { this.sigCanvas = ref }}
            canvasProps={{className: 'sigCanvas', style: {backgroundColor: this.props.bgColor.value}}}
          />
          <div className="dialogButton" style={{float: 'right', marginRight: -5, marginTop: 10}} onMouseDown={(e) => {this.handleSubmit(e)}}>
            <p>Done</p>
          </div>
          <div className="dialogButton" style={{float: 'right', marginRight: 10, marginTop: 10}} onMouseDown={this.handleClear}>
            <p>Clear</p>
          </div>
          <div className="declineButton" style={{float: 'right', marginRight: 10, marginTop: 10}} onMouseDown={this.props.handleCancel}>
            <p>Cancel</p>
          </div>
        </div>
      </Dialog>
    )
  }
}

export default BrushDialog;
