import React, { Component } from 'react';
import Utils from '../constants/utils';

const TEXT_TOOLS = ["bold", "italic", "underline"];
const STICKER_TOOLS = ["sticker"];
const STICKERS = [
  {
    setName: 'Penguin',
    stickers: [
      {name: "Boo", url: "./stickers/penguin_set/boo-01.png"},
      {name: "Dafuq", url: "./stickers/penguin_set/dafuq-01.png"},
      {name: "ToTheRescue", url: "./stickers/penguin_set/to-the-rescue-01.png"},
    ]
  },
]
const ALIGN_TOOLS = ["align-left", "align-center", "align-right", "align-justify"];
const FILE_TOOLS = ["image"];
const LINK_TOOLS = ["video", "link"];

class TextTools extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleTextToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleTextToolToggle(tool);
  }

  render() {
    return (
      <div className="textToolMenu">
        {
          TEXT_TOOLS.map((t, i) => {
            return (
              this.props.props.editorState.getCurrentInlineStyle().has(t.toUpperCase()) ? (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-dark-01.png"} onMouseDown={(e) => {this.handleTextToolToggle(t, e)}} />
              ) : (
                this.state.currHoverTool === t ? (
                  <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-dark-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleTextToolToggle(t, e)}} />
                ) : (
                  <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleTextToolToggle(t, e)}} />
                )
              )
            )
          })
        }
      </div>
    )
  }
}

class CustomTextTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currFont: this.getCurrentFont(),
      currTextColor: this.getCurrentFont(),
      currHighlightColor: this.getCurrentHighlightColor(),
      currTextSize: this.getCurrentTextSize(),
      currHoverFont: this.getCurrentFont(),
      currHoverTextColor: this.getCurrentTextColor(),
      currHoverHighlightColor: this.getCurrentHighlightColor(),
      currHoverTextSize: this.getCurrentTextSize(),
    }
  }

  getCurrentFont = () => {
    // Apply only to some text (selection)
    // let currFont = this.props.props.defaultFont;
    // let filteredFont = this.props.props.fonts.filter(f => { return this.props.props.editorState.getCurrentInlineStyle().has(f.style) });
    // if (filteredFont.length > 0) { currFont = filteredFont[0]; }
    // return currFont;

    // Apply globally
    return this.props.props.currFont;
  }

  getCurrentTextColor = () => {
    let currTextColor = this.props.props.defaultTextColor;
    if (this.props.props.titleOnFocus) {
      let filteredTextColor = this.props.props.textColors.filter(c => { return this.props.props.titleEditorState.getCurrentInlineStyle().has(c.style) });
      if (filteredTextColor.length > 0) { currTextColor = filteredTextColor[0]; }
    } else {
      let filteredTextColor = this.props.props.textColors.filter(c => { return this.props.props.editorState.getCurrentInlineStyle().has(c.style) });
      if (filteredTextColor.length > 0) { currTextColor = filteredTextColor[0]; }
    }
    return currTextColor;
  }

  getCurrentHighlightColor = () => {
    let currHighlightColor = this.props.props.defaultHighlightColor;
    let filteredHighlightColor = this.props.props.highlightColors.filter(c => { return this.props.props.editorState.getCurrentInlineStyle().has(c.style) });
    if (filteredHighlightColor.length > 0) { currHighlightColor = filteredHighlightColor[0]; }
    return currHighlightColor;
  }

  getCurrentTextSize = () => {
    let currTextSize = this.props.props.defaultTextSize;
    let filtertedTextSize = this.props.props.textSizes.filter(s => { return this.props.props.editorState.getCurrentInlineStyle().has(s.style) });
    if (filtertedTextSize.length > 0) { currTextSize = filtertedTextSize[0]; }
    return currTextSize;
  }

  getCurrentPreviewText= () => {
    let currMaxTextSize = this.state.currHoverTextSize.maxPreviewLength;
    let previewText = "Preview";
    let editorState = this.props.props.editorState;
    let selectionState = editorState.getSelection();
    let anchorKey = selectionState.getAnchorKey();
    let currContent = editorState.getCurrentContent();
    let currContentBlock = currContent.getBlockForKey(anchorKey);
    let start = selectionState.getStartOffset();
    let end = selectionState.getEndOffset();
    let selectedText = currContentBlock.getText().slice(start, end);
    if (selectedText != "") {
      previewText = selectedText;
    }
    if (selectedText.length > currMaxTextSize) {
      previewText = selectedText.substr(0, currMaxTextSize) + " ...";
    }
    return previewText;
  }

  showCustomTextOptions = (e) => {
    this.setState({
      currFont: this.getCurrentFont(),
      currTextColor: this.getCurrentTextColor(),
      currHighlightColor: this.getCurrentHighlightColor(),
      currTextSize: this.getCurrentTextSize(),
      currHoverFont: this.getCurrentFont(),
      currHoverTextColor: this.getCurrentTextColor(),
      currHoverHighlightColor: this.getCurrentHighlightColor(),
      currHoverTextSize: this.getCurrentTextSize()
    });
    this.props.showCustomTextOptions(e);
  }

  handleTextColorChange = (color, e) => {
    e.preventDefault();
    this.setState({currTextColor: color, currHoverTextColor: color});
    if (this.getCurrentTextColor().label != color.label) {
      this.props.handleTextColorChange(color);
    }
  }

  handleHighlightColorChange = (color, e) => {
    e.preventDefault();
    this.setState({currHighlightColor: color, currHoverHighlightColor: color});
    if (this.getCurrentHighlightColor().label != color.label) {
      this.props.handleHighlightColorChange(color);
    }
  }

  handleFontToolChange = (font, e) => {
    e.preventDefault();
    this.setState({currFont: font, currHoverFont: font});
    if (this.getCurrentFont().label != font.label) {
      this.props.handleFontToolChange(font);
    }
  }

  handleTextSizeChange = (size, e) => {
    e.preventDefault();
    this.setState({currTextSize: size});
    if (this.getCurrentTextSize().label != size.label) {
      this.props.handleTextSizeChange(size);
    }
  }

  render() {
    return (
      <div className="customTextToolMenu">
        <div className="dropdown">
          <button style={{backgroundColor: this.getCurrentHighlightColor().value, color: this.getCurrentTextColor().value}} onMouseDown={(e) => {this.showCustomTextOptions(e)}} className="dropbtn">T</button>
          <div id="customTextDropdown" className="dropdown-content">
            <div className="customTextPreviewContainer" style={{backgroundColor: this.state.currHoverHighlightColor.value}}>
              <span className="customTextPreviewText" style={{color: this.state.currHoverTextColor.value, fontFamily: this.state.currHoverFont.value, fontSize: this.state.currHoverTextSize.value }}>{this.getCurrentPreviewText()}</span>
            </div>
            <div className="textSizeContainer">
              <p className="colorsHeader">Size</p>
              {
                this.props.props.textSizes.map((s, i) => {
                  return (
                    s.label === this.state.currTextSize.label ? (
                      <div key={i} className="sizeBox" style={{borderColor: "#39b287", borderStyle: 'solid', borderWidth: 2}} onMouseDown={(e) => {this.handleTextSizeChange(s, e)}}>
                        <p className="sizeLabel">{s.label}</p>
                      </div>
                    ) : (
                      <div key={i} className="sizeBox" style={{padding: 2}} onMouseEnter={() => {this.setState({currHoverTextSize: s})}} onMouseLeave={() => {this.setState({currHoverTextSize: this.state.currTextSize})}} onMouseDown={(e) => {this.handleTextSizeChange(s, e)}}>
                        <p className="sizeLabel">{s.label}</p>
                      </div>
                    )
                  )
                })
              }
            </div>
            <div style={{clear: 'both'}}></div>
            <div className="colorsContainer">
              <div className="textColorsContainer">
                <p className="colorsHeader">Text</p>
                {
                  this.props.props.textColors.map((c, i) => {
                    return (
                      c.label === this.state.currTextColor.label ? (
                        <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseDown={(e) => {this.handleTextColorChange(c, e)}}></div>
                      ) : (
                        <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseEnter={() => {this.setState({currHoverTextColor: c})}} onMouseLeave={() => {this.setState({currHoverTextColor: this.state.currTextColor})}} onMouseDown={(e) => {this.handleTextColorChange(c, e)}}></div>
                      )
                    )
                  })
                }
              </div>
              <div className="highlightColorsContainer">
                <p className="colorsHeader">Highlight</p>
                {
                  this.props.props.highlightColors.map((c, i) => {
                    return (
                      c.label === this.state.currHighlightColor.label ? (
                        <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseDown={(e) => {this.handleHighlightColorChange(c, e)}}></div>
                      ) : (
                        <div key={i} className="colorBox" style={{backgroundColor: c.value}} onMouseEnter={() => {this.setState({currHoverHighlightColor: c})}} onMouseLeave={() => {this.setState({currHoverHighlightColor: this.state.currHighlightColor})}} onMouseDown={(e) => {this.handleHighlightColorChange(c, e)}}></div>
                      )
                    )
                  })
                }
              </div>
              <div style={{clear: 'both'}}></div>
            </div>
            <div className="fontsContainer">
              <p className="colorsHeader">Fonts</p>
              {
                this.props.props.fonts.map((f, i) => {
                  return (
                    f.label === this.state.currFont.label ? (
                      <div key={i} className="fontBox" style={{borderColor: "#39b287", borderStyle: 'solid', borderWidth: 2}} onMouseDown={(e) => {this.handleFontToolChange(f, e)}}>
                        <p className="fontLabel" style={{fontFamily: f.value}}>{f.label}</p>
                      </div>
                    ) : (
                      <div key={i} className="fontBox" onMouseEnter={() => {this.setState({currHoverFont: f})}} onMouseLeave={() => {this.setState({currHoverFont: this.state.currFont})}} onMouseDown={(e) => {this.handleFontToolChange(f, e)}}>
                        <p className="fontLabel" style={{fontFamily: f.value}}>{f.label}</p>
                      </div>
                    )
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class CardBackgroundTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currBGColor: this.props.props.currBGColor,
    };
  }

  render() {
    return (
      <div className="bgToolMenu">
        <img alt={'background color'} className="toolMenuIcon bgDropBtn" src={"./images/bg-icon-dark-01.png"} onMouseDown={(e) => {this.props.showBGOptions(e)}} />
        <div id="bgDropdown" className="bg-dropdown-content">
          <p className="bgHeader">{"Card Background"}</p>
          {
            this.props.props.backgroundColors.map((c, i) => {
              return (
                this.props.props.currBGColor.label === c.label ? (
                  <div key={i} className="bgColorContainerSelected" style={{backgroundColor: c.value}}></div>
                ) : (
                  <div key={i} className="bgColorContainer" style={{backgroundColor: c.value}} onMouseDown={(e) => {this.props.handleBGChange(c, e)}}></div>
                )
              )
            })
          }
        </div>
      </div>
    )
  }
}

class StickerTools extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleStickerTool = (sticker, e) => {
    e.preventDefault();
    this.props.handleStickerTool(sticker);
  }

  render() {
    return (
      <div className="stickerToolMenu">
        {
          STICKER_TOOLS.map((t, i) => {
            return (
              this.state.currHoverTool === t ? (
                <img alt={t} key={i} className="toolMenuIcon stickerDropBtn" src={"./images/" + t + "-icon-dark-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.props.showStickerOptions(e)}} />
              ) : (
                <img alt={t} key={i} className="toolMenuIcon stickerDropBtn" src={"./images/" + t + "-icon-light-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.props.showStickerOptions(e)}} />
              )
            )
          })
        }

        <div id="stickerToolsDropdown" className="stickerToolsDropdown">
          {
            STICKERS.map((s, i) => {
              return (
                <div className="stickersContainer" key={i} >
                  <p className="stickersHeader">{s.setName}</p>
                  {
                    s.stickers.map((st, i) => {
                      return (
                          <img alt={st.name} key={i} className="stickerImage" src={st.url} onMouseDown={(e) => {this.handleStickerTool(st, e)}} />
                      )
                    })
                  }
                  <div style={{clear: 'both'}}/>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

class AlignTools extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  handleAlignToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleAlignToolToggle(tool);
  }

  getCurrentAlignment = () => {
    let currAlignment = this.props.props.defaultAlignment;

    let editorState = this.props.props.editorState;
    let selectionState = editorState.getSelection();
    let anchorKey = selectionState.getAnchorKey();
    let currContent = editorState.getCurrentContent();
    let currContentBlock = currContent.getBlockForKey(anchorKey);
    let currContentBlockType = currContentBlock.getType()
    if (currContentBlockType == 'align-left' || currContentBlockType == 'align-center' || currContentBlockType == 'align-right' || currContentBlockType == 'align-justify') {
      currAlignment = currContentBlock.getType();
    }
    return currAlignment;

    // let start = selectionState.getStartOffset();
    // let end = selectionState.getEndOffset();
    // let selectedText = currContentBlock.getText().slice(start, end);
  }

  render() {
    return (
        <div className="alignToolMenu">
          <div className="alignToolMenuWeb">
            {
              ALIGN_TOOLS.map((t, i) => {
                return (
                  this.getCurrentAlignment() === t ? (
                    <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-dark-01.png"} onMouseDown={(e) => {this.handleAlignToolToggle(t, e)}} />
                  ) : (
                    this.state.currHoverTool === t ? (
                      <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-dark-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleAlignToolToggle(t, e)}} />
                    ) : (
                      <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleAlignToolToggle(t, e)}} />
                    )
                  )
                )
              })
            }
          </div>
          {/* MOBILE AND SMALLER WEB WIDTH */}
          <div className="alignToolMenuMobile">
            {
              ALIGN_TOOLS.map((t, i) => {
                return (
                  this.getCurrentAlignment() === t &&
                  <img alt={t} key={i} className="toolMenuIcon alignDropBtn" src={"./images/" + t + "-icon-dark-01.png"} onMouseDown={(e) => {this.props.showAlignOptions(e)}} />
                )
              })
            }
            <div id="alignToolsDropdown" className="alignToolMenuMobileDropdown">
              {
                ALIGN_TOOLS.map((t, i) => {
                  return (
                    this.state.currHoverTool === t ? (
                      <img alt={t} key={i} className="alignToolMenuMobileIcon" src={"./images/" + t + "-icon-dark-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleAlignToolToggle(t, e)}} />
                    ) : (
                      <img alt={t} key={i} className="alignToolMenuMobileIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleAlignToolToggle(t, e)}} />
                    )
                  )
                })
              }
            </div>
          </div>
        </div>
    )
  }
}

class FileTools extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    return (
      <div className="fileToolMenu">
        {
          FILE_TOOLS.map((t, i) => {
            return (
              <div key={i} className="image-upload">
                <label htmlFor="file-input">
                  {
                    this.state.currHoverTool === t ? (
                      <img className="toolMenuIcon" alt={t} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} src={"./images/" + t + "-icon-dark-01.png"} />
                    ) : (
                      <img className="toolMenuIcon" alt={t} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} src={"./images/" + t + "-icon-light-01.png"} />
                    )
                  }
                </label>
                <input id="file-input" type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.props.fileChangedHandler} />
              </div>
            )
          })
        }
      </div>
    )
  }
}

class LinkTools extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  handleLinkToolToggle = (tool, e) => {
    e.preventDefault();
    this.props.handleLinkToolToggle(tool);
  }

  render() {
    return (
      <div className="linkToolMenu">
        {
          LINK_TOOLS.map((t, i) => {
            return (
              this.state.currHoverTool === t ? (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-dark-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleLinkToolToggle(t, e)}} />
              ) : (
                <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onMouseEnter={() => {this.setState({currHoverTool: t})}} onMouseLeave={() => {this.setState({currHoverTool: null})}} onMouseDown={(e) => {this.handleLinkToolToggle(t, e)}} />
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
    this.state = {
      activeDropdown: null
    }
  }

  fileChangedHandler = (event) => {
    this.props.handleImageTool(event.target.files[0]);
  }

  showCustomTextOptions = (e) => {
    e.preventDefault();
    if (this.state.activeDropdown) {
      if (this.state.activeDropdown.classList.contains("show") && this.state.activeDropdown.getAttribute('id') !== "customTextDropdown") {
        this.state.activeDropdown.classList.toggle("show");
      }
    }

    this.setState({activeDropdown: document.getElementById("customTextDropdown")});
    document.getElementById("customTextDropdown").classList.toggle("show");
  }

  showDropdownOptions = (id) => {
    if (this.state.activeDropdown) {
      if (this.state.activeDropdown.classList.contains("show") && this.state.activeDropdown.getAttribute('id') !== id) {
        this.state.activeDropdown.classList.toggle("show");
      }
    }

    this.setState({activeDropdown: document.getElementById(id)});
    document.getElementById(id).classList.toggle("show");
  }

  showAlignOptions = (e) => {
    e.preventDefault();
    this.showDropdownOptions("alignToolsDropdown");
  }

  showStickerOptions = (e) => {
    e.preventDefault();
    this.showDropdownOptions("stickerToolsDropdown");
  }

  showBGOptions = (e) => {
    e.preventDefault();
    this.showDropdownOptions("bgDropdown");
  }

  render() {
    if (this.props.show) {
      return (
        <div className="toolMenu">
          <TextTools
            props={this.props}
            handleTextToolToggle={this.props.handleTextToggleChange}
          />
          <CustomTextTools
            props={this.props}
            handleFontToolChange={this.props.handleFontTool}
            handleTextColorChange={this.props.handleTextColorChange}
            handleHighlightColorChange={this.props.handleHighlightColorChange}
            handleTextSizeChange={this.props.handleTextSizeChange}
            showCustomTextOptions={this.showCustomTextOptions}
          />
          <CardBackgroundTools
            props={this.props}
            showBGOptions={this.showBGOptions}
            handleBGChange={this.props.handleBGChange}
          />
          <StickerTools
            props={this.props}
            handleStickerTool={this.props.handleStickerTool}
            showStickerOptions={this.showStickerOptions}
          />
          <div className="emojiContainer">
            {this.props.children}
          </div>
          <AlignTools
            props={this.props}
            showAlignOptions={this.showAlignOptions}
            handleAlignToolToggle={this.props.handleAlignToggleChange}
          />
          <FileTools
            fileChangedHandler={this.fileChangedHandler}
          />
          <LinkTools
            handleLinkToolToggle={this.props.openLinkInputDialog}
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
  if (!event.target.matches('.dropbtn') &&
      !event.target.matches('.alignDropBtn') &&
      !event.target.matches('.stickerDropBtn') &&
      !event.target.matches('.bgDropBtn') &&
      !event.target.matches('.dropdown-content') &&
      !event.target.matches('.bg-dropdown-content') &&
      !event.target.matches('.bgHeader') &&
      !event.target.matches('.customTextPreviewContainer') &&
      !event.target.matches('.customTextPreviewText') &&
      !event.target.matches('.colorsContainer') &&
      !event.target.matches('.textColorsContainer') &&
      !event.target.matches('.highlightColorsContainer') &&
      !event.target.matches('.colorsHeader')
    ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    var dropdowns = document.getElementsByClassName("alignToolMenuMobileDropdown");
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    var dropdowns = document.getElementsByClassName("stickerToolsDropdown");
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    var dropdowns = document.getElementsByClassName("bg-dropdown-content");
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

export default ToolMenu;
