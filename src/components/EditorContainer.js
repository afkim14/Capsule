import React, { Component } from 'react'
import EditorHome from './EditorHome';
import TutorialPage from './TutorialPage';

class EditorContainer extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      currentPage: "main"
    }
  }

  changePage = (name) => {
    this.setState({currentPage: name});
  }

  componentDidMount() {
  }

  render() {
    if (this.state.currentPage === "main") {
      return (
        <EditorHome changePage={this.changePage} />
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default EditorContainer;
