import React, { Component } from 'react';

const TEXT_TOOLS = ["bold", "italic", "underline"];
const ALIGN_TOOLS = ["left", "center", "right", "justify"];
const FILE_TOOLS = ["image"];
const LINK_TOOLS = ["video", "link"];

class TextTools extends Component {
  render() {
    const { props, handleTextToolToggle } = this.props;
    return (
      <div className="textToolMenu">
        {
          TEXT_TOOLS.map((t, i) => {
            return (
              props.editorState.getCurrentInlineStyle().has(t.toUpperCase()) ? (
                <img alt={t} key={i} className="toolMenuIconSelected" src={"./images/" + t + "-icon-dark-01.png"} onMouseDown={(e) => {handleTextToolToggle(t, e)}} />
              ) : (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseDown={(e) => {handleTextToolToggle(t, e)}} />
              )
            )
          })
        }
      </div>
    )
  }
}

class ColorTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currHoverTextColor: this.getCurrentTextColor(),
      currHoverHighlightColor: this.getCurrentHighlightColor()
    }
  }

  getCurrentTextColor = () => {
    let currTextColor = this.props.props.defaultTextColor.value;
    let filteredTextColor = this.props.props.textColors.filter(c => { return this.props.props.editorState.getCurrentInlineStyle().has(c.style) });
    if (filteredTextColor.length > 0) { currTextColor = filteredTextColor[0].value; }
    return currTextColor;
  }

  getCurrentHighlightColor = () => {
    let currHighlightColor = this.props.props.defaultHighlightColor.value;
    let filteredHighlightColor = this.props.props.highlightColors.filter(c => { return this.props.props.editorState.getCurrentInlineStyle().has(c.style) });
    if (filteredHighlightColor.length > 0) { currHighlightColor = filteredHighlightColor[0].value; }
    return currHighlightColor;
  }

  showColorOptions = (e) => {
    this.setState({currHoverTextColor: this.getCurrentTextColor(), currHoverHighlightColor: this.getCurrentHighlightColor()})
    this.props.showColorOptions(e);
  }

  render() {
    return (
      <div className="colorToolMenu">
        <div className="dropdown">
          <button style={{backgroundColor: this.getCurrentHighlightColor(), color: this.getCurrentTextColor()}} onMouseDown={(e) => {this.showColorOptions(e)}} className="dropbtn">T</button>
          <div id="myColorDropdown" className="dropdown-content">
            <div>
              <div className="colorPreviewContainer" style={{backgroundColor: this.state.currHoverHighlightColor}}>
                <p className="colorPreviewText" style={{color: this.state.currHoverTextColor}}>Preview</p>
              </div>
              <div className="colorsContainer">
                <div className="textColorsContainer">
                  <p className="colorsHeader">Foreground</p>
                  {
                    this.props.props.textColors.map((c, i) => {
                      return (
                        c.value === this.state.currTextColor ? (
                          <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseDown={(e) => {this.props.handleTextColorChange(c, e)}}></div>
                        ) : (
                          <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseEnter={() => {this.setState({currHoverTextColor: c.value})}} onMouseLeave={() => {this.setState({currHoverTextColor: this.props.props.defaultTextColor.value})}} onMouseDown={(e) => {this.props.handleTextColorChange(c, e)}}></div>
                        )
                      )
                    })
                  }
                </div>
                <div className="highlightColorsContainer">
                  <p className="colorsHeader">Background</p>
                  {
                    this.props.props.highlightColors.map((c, i) => {
                      return (
                        c.value === this.state.currHighlightColor ? (
                          <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseDown={(e) => {this.props.handleHighlightColorChange(c, e)}}></div>
                        ) : (
                          <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseEnter={() => {this.setState({currHoverHighlightColor: c.value})}} onMouseLeave={() => {this.setState({currHoverHighlightColor: this.props.props.defaultHighlightColor.value})}} onMouseDown={(e) => {this.props.handleHighlightColorChange(c, e)}}></div>
                        )
                      )
                    })
                  }
                </div>
                <div style={{clear: 'both'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class AlignTools extends Component {
  render() {
    const { props, handleAlignToolToggle } = this.props;
    return (
      <div className="alignToolMenu">
        {
          ALIGN_TOOLS.map((t, i) => {
            return (
              props.alignment === t ? (
                <img alt={t} key={i} className="toolMenuIconSelected" src={"./images/" + t + "-icon-dark-01.png"} onMouseDown={(e) => {handleAlignToolToggle(t, e)}} />
              ) : (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseDown={(e) => {handleAlignToolToggle(t, e)}} />
              )
            )
          })
        }
      </div>
    )
  }
}

class FileTools extends Component {
  render() {
    const { fileChangedHandler } = this.props;
    return (
      <div className="fileToolMenu">
        {
          FILE_TOOLS.map((t, i) => {
            return (
              <div key={i} className="image-upload">
                <label htmlFor="file-input">
                  <img className="toolMenuIcon" alt={t} src={"./images/" + t + "-icon-light-01.png"} />
                </label>
                <input id="file-input" type="file" onChange={fileChangedHandler} />
              </div>
            )
          })
        }
      </div>
    )
  }
}

class LinkTools extends Component {
  render() {
    const { handleLinkToolToggle, handleVideoToolToggle } = this.props;
    return (
      <div className="linkToolMenu">
        {
          LINK_TOOLS.map((t, i) => {
            return (
              t == "link" ? (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseDown={(e) => {handleLinkToolToggle(t, e)}} />
              ) : (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseDown={(e) => {handleVideoToolToggle(t, e)}} />
              )
            )
          })
        }
      </div>
    )
  }
}

class ToolMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleTextToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleTextToggleChange(tool);
  }

  handleAlignToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleAlignToggleChange(tool);
  }

  handleLinkToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleLinkTool();
  }

  handleVideoToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleVideoTool();
  }

  handleTextColorChange = (color, e) => {
    e.preventDefault();
    this.props.handleTextColorChange(color);
  }

  handleHighlightColorChange = (color, e) => {
    e.preventDefault();
    this.props.handleHighlightColorChange(color);
  }

  fileChangedHandler = (event) => {
    try {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.props.handleImageTool(reader.result);
      };
      reader.onerror = function (error) {
          console.log('Error: ', error);
      };
    } catch(err) {
      // Error Handling
      // alert(err.message);
      return;
    }
  }

  showColorOptions = (e) => {
    e.preventDefault();
    document.getElementById("myColorDropdown").classList.toggle("show");
  }

  render() {
    if (this.props.show) {
      return (
        <div className="toolMenu">
          <TextTools
            props={this.props}
            handleTextToolToggle={this.handleTextToolToggle}
          />
          <ColorTools
            props={this.props}
            handleTextColorChange={this.handleTextColorChange}
            handleHighlightColorChange={this.handleHighlightColorChange}
            showColorOptions={this.showColorOptions}
          />
          {this.props.children}
          <AlignTools
            props={this.props}
            handleAlignToolToggle={this.handleAlignToolToggle}
          />
          <FileTools
            fileChangedHandler={this.fileChangedHandler}
          />
          <LinkTools
            handleLinkToolToggle={this.handleLinkToolToggle}
            handleVideoToolToggle={this.handleVideoToolToggle}
          />
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

export default ToolMenu;
