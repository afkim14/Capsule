import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="container" style={{textAlign: 'center'}}>
        <div className="warningContainer">
          <img className="centerIcons" src={"/images/404-icon-01.png"} />
          <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>Oops! This page does not exist.</p>
          <p className="warningMessage">We can help by redirecting you home.</p>
          <Link style={{textDecoration: 'none'}} to={"/"}>
            <div className="dialogButton" style={{margin: '0px auto', marginTop: 30}}>
              <p>Go Home</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}

export default NotFoundPage;
