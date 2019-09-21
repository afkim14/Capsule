import React, { Component } from 'react';
import TutorialDialog from './TutorialDialog';
import { Link} from 'react-router-dom';
import { TemplateIDs } from '../constants/templates';
import Fade from 'react-reveal/Fade';
import ScrollToTop from './ScrollToTop';

class TemplatesHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
    }
  }

  componentDidMount() {
    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: #3e3e3e;");
  }

  render() {
    return (
      <div>
        {/*
        <div className="mobileMessageContainer">
          <div className="warningContainer" style={{textAlign: 'center'}}>
            <img className="centerIcons" src={"/images/404-icon-01.png"} />
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>We apologize for the inconveniece.</p>
            <p className="warningMessage">We are still working on a mobile version. Please access the website on a laptop or computer.</p>
          </div>
        </div>
        */}
        <div className="container desktopContainer nonEditorContainer" style={{marginTop: 0}}>
          <Fade>
            <div className="mainPageOpeningContainer">
              <div className="mainPageTopPadding"/>
              <Link style={{textDecoration: 'none'}} to="/">
                <p className="logo" style={{fontSize: 40}}>Capsule</p>
              </Link>
              <div className="getInvolvedContainer">
              </div>
              <p className="logoSubtext">Send a meaningful message to anyone at any time.</p>
              <div className="homeButtonContainer">
                <Link to="/editor">
                  <div className="dialogButton writeCapsuleButton" style={{float: 'left', marginTop: 10}}>
                    <p>Write a Capsule</p>
                  </div>
                </Link>
                <Link to="/collaborate">
                  <div className="dialogButton" style={{float: 'left', marginTop: 10, width: 120, marginLeft: 20}}>
                    <p>Get Involved</p>
                  </div>
                </Link>
              </div>
              <div style={{clear: 'both'}} />
              <p className="sectionHeader" style={{marginTop: 50}}>Featured Templates</p>
              <div className="templatesContainer">
                {
                  TemplateIDs.map((t, i) => {
                    return (
                      <div key={i} className="templateBox" style={{marginRight: i % 2 === 0 ? 70 : 0}}>
                        <p className="templateTitle">{t.label}</p>
                        <p className="templateDescription">{t.desc}</p>
                        <Link to={"/editor/" + t.id}>
                          <div className="templateImageBox" style={{backgroundColor: t.bgColor, backgroundImage: "url(" + t.img + ")"}}></div>
                        </Link>
                      </div>
                    )
                  })
                }
              </div>
              {/*<img className="arrow" src={"/images/arrow-down-01.png"} />*/}
            </div>
          </Fade>
          {/*
          <div className="getInvolvedContainer">
            <Link to="/patchnotes">
              <div className="dialogButton" style={{float: 'left', marginTop: 10, marginLeft: 20, width: 120}}>
                <p>Patch Notes</p>
              </div>
            </Link>
          </div>
          */}
          <ScrollToTop />
          <div style={{clear: 'both'}} />
          <div style={{marginTop: 100}}/>
        </div>
      </div>
    )
  }
}

export default TemplatesHome;
