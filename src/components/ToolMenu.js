import React, { Component } from 'react';

const TEXT_TOOLS = ["bold", "italic", "underline"];
const ALIGN_TOOLS = ["left", "center", "right", "justify"];
const FILE_TOOLS = ["image"];
const LINK_TOOLS = ["youtube", "link"];

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
  render() {
    const { props, handleTextColorChange, handleHighlightColorChange, showColorOptions } = this.props;
    let currTextColor = props.defaultTextColor.value;
    let currHighlightColor = props.defaultHighlightColor.value;
    let filteredTextColor = props.textColors.filter(c => { return props.editorState.getCurrentInlineStyle().has(c.style) });
    if (filteredTextColor.length > 0) { currTextColor = filteredTextColor[0].value; }
    let filteredHighlightColor = props.highlightColors.filter(c => { return props.editorState.getCurrentInlineStyle().has(c.style) });
    if (filteredHighlightColor.length > 0) { currHighlightColor = filteredHighlightColor[0].value; }

    return (
      <div className="colorToolMenu">
        <div className="dropdown">
          <button style={{backgroundColor: currHighlightColor, color: currTextColor}} onMouseDown={(e) => {showColorOptions(e)}} className="dropbtn">T</button>
          <div id="myColorDropdown" className="dropdown-content">
            <div>
              <div className="textColorsContainer">
                <p className="colorsHeader">Foreground</p>
                {
                  props.textColors.map((c, i) => {
                    return (
                      c.value === currTextColor ? (
                        <a key={i} onMouseDown={(e) => {handleTextColorChange(c, e)}} style={{color: c.value, backgroundColor: c.value, borderWidth: 2, borderStyle: "solid", borderColor: "#eb2f39"}}>{c.label}</a>
                      ) : (
                        <a key={i} onMouseDown={(e) => {handleTextColorChange(c, e)}} style={{color: c.value, backgroundColor: c.value}}>{c.label}</a>
                      )
                    )
                  })
                }
              </div>
              <div className="highlightColorsContainer">
                <p className="colorsHeader">Background</p>
                {
                  props.highlightColors.map((c, i) => {
                    return (
                      c.value === currHighlightColor ? (
                        <a key={i} onMouseDown={(e) => {handleHighlightColorChange(c, e)}} style={{color: c.value, backgroundColor: c.value, borderWidth: 2, borderStyle: "solid", borderColor: "#eb2f39"}}>{c.label}</a>
                      ) : (
                        <a key={i} onMouseDown={(e) => {handleHighlightColorChange(c, e)}} style={{color: c.value, backgroundColor: c.value}}>{c.label}</a>
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
    const { handleLinkToolToggle } = this.props;
    return (
      <div className="linkToolMenu">
        {
          LINK_TOOLS.map((t, i) => {
            return (
              <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseDown={(e) => {handleLinkToolToggle(t, e)}} />
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
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    var self = this;
    reader.onload = () => {
      self.props.handleImageTool(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
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
          <AlignTools
            props={this.props}
            handleAlignToolToggle={this.handleAlignToolToggle}
          />
          <FileTools
            fileChangedHandler={this.fileChangedHandler}
          />
          <LinkTools
            handleLinkToolToggle={this.handleLinkToolToggle}
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
