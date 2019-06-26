import React, { Component } from 'react'
import MainHome from './MainHome';

class MainContainer extends Component {
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
        <div>
          <MainHome />
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default MainContainer;
