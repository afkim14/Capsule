import React, { Component } from 'react';
import autosize from 'autosize';

const TEXT_TOOLS = ["bold", "italic"];
const ALIGN_TOOLS = ["left", "center", "right", "justify"];
const FILE_TOOLS = ["image", "youtube"];

class MainHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      title: "",
      body: "",
      bold: false,
      italic: false,
      alignment: 'left'
    }
  }

  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  newCard = () => {
    this.setState({title: "", body: ""});
  }

  handleTitleChange = (event) => {
    this.setState({title: event.target.value});
  }

  handleBodyChange = (event) => {
    this.setState({body: event.target.value});
  }

  handleTextToolToggle = (tool) => {
    this.setState({ [tool]: !this.state[tool]});
  }

  handleAlignToolToggle = (tool) => {
    this.setState({alignment: tool});
  }

  render() {
    return (
      <div className="container">

        <div className="navbar">
          <button className="newCardButton mainBGColor" onClick={this.newCard}>New Card</button>
          <button className="shareButton mainBGColor">Share</button>
        </div>
        <div style={{clear: 'both'}}/>

        <div className="toolMenu">
          <div className="textToolMenu">
            {
              TEXT_TOOLS.map((t, i) => {
                return (
                  this.state[t] ? (
                    <img alt={t} key={i} className="toolMenuIconSelected" src={"./images/" + t + "-icon-dark-01.png"} onClick={() => {this.handleTextToolToggle(t)}} />
                  ) : (
                    <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onClick={() => {this.handleTextToolToggle(t)}} />
                  )
                )
              })
            }
          </div>
          <div className="alignToolMenu">
            {
              ALIGN_TOOLS.map((t, i) => {
                return (
                  this.state.alignment == t ? (
                    <img alt={t} key={i} className="toolMenuIconSelected" src={"./images/" + t + "-icon-dark-01.png"} onClick={() => {this.handleAlignToolToggle(t)}} />
                  ) : (
                    <img alt={t} key={i} className="toolMenuIcon" src={"./images/" + t + "-icon-light-01.png"} onClick={() => {this.handleAlignToolToggle(t)}} />
                  )
                )
              })
            }
          </div>
        </div>

        <textarea spellCheck="false" placeholder="Greeting ..." value={this.state.title} onChange={this.handleTitleChange} className="titleTextArea mainFGColor mainBGColor" />
        <textarea spellCheck="false" placeholder="Write something here ..." value={this.state.body} onChange={this.handleBodyChange} className="cardTextArea mainFGColor mainBGColor" />
      </div>
    )
  }
}

export default MainHome;
