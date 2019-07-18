import React, { Component } from 'react';
import TutorialDialog from './TutorialDialog';
import { Link} from 'react-router-dom';
import { TemplateIDs } from '../constants/templates';

class TemplatesHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      openTutorialDialog: false
    }
  }

  componentDidMount() {
    document.getElementsByTagName("html")[0].setAttribute("style", "background-color: #3e3e3e;");
  }

  render() {
    return (
      <div>
        <div className="mobileMessageContainer">
          <div className="warningContainer" style={{textAlign: 'center'}}>
            <img className="centerIcons" src={"/images/404-icon-01.png"} />
            <p className="warningMessage mainFGColor mainBGColor" style={{color: "#39b287", fontWeight: 'bold'}}>We apologize for the inconveniece.</p>
            <p className="warningMessage">We are still working on a mobile version. Please access the website on a laptop or computer.</p>
          </div>
        </div>
        <div className="container desktopContainer">
          <TutorialDialog
            open={this.state.openTutorialDialog}
            close={() => {this.setState({openTutorialDialog: false})}}
          />
          <Link style={{textDecoration: 'none'}} to="/">
            <p className="logo">Capsule</p>
          </Link>
          <p className="logoSubtext">Send a meaningful message to anyone at any time.</p>
          <div className="homeButtonContainer">
            <Link to="/editor">
              <div className="dialogButton" style={{float: 'left', marginTop: 10, width: 120}}>
                <p>Blank Card</p>
              </div>
            </Link>
            <div className="dialogButton" style={{float: 'left', marginTop: 10, marginLeft: 20}} onMouseDown={()=>{this.setState({openTutorialDialog: true})}}>
              <p>Tutorial</p>
            </div>
            <Link to="/collaborate">
              <div className="dialogButton" style={{float: 'left', marginTop: 10, marginLeft: 20, width: 120}}>
                <p>Collaborate</p>
              </div>
            </Link>
          </div>
          <div style={{clear: 'both'}} />
          <div className="templatesContainer">
            {
              TemplateIDs.map((t, i) => {
                return (
                  <div key={i} className="templateBox" style={{marginRight: i % 2 === 0 ? 30 : 0}}>
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
          <div style={{clear: 'both'}} />
          <div style={{marginTop: 100}}/>
        </div>
      </div>
    )
  }
}

export default TemplatesHome;
