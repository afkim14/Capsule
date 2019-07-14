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
      <div className="container" style={{width: "60%"}}>
        <TutorialDialog
          open={this.state.openTutorialDialog}
          close={() => {this.setState({openTutorialDialog: false})}}
        />
        <p className="logo">Capsule</p>
        <p className="logoSubtext">This is an application to write about things.</p>
        <div className="homeButtonContainer">
          <Link to="/editor">
            <div className="dialogButton" style={{float: 'left', marginTop: 10}}>
              <p>Blank Card</p>
            </div>
          </Link>
          <div className="dialogButton" style={{float: 'left', marginTop: 10, marginLeft: 10}} onMouseDown={()=>{this.setState({openTutorialDialog: true})}}>
            <p>Tutorial</p>
          </div>
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
    )
  }
}

export default TemplatesHome;
