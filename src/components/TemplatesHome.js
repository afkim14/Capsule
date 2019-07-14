import React, { Component } from 'react';
import TutorialDialog from './TutorialDialog';
import { Link} from 'react-router-dom';

const TemplateIDs = [
  {label: "Birthday", desc: "Write a relatively formal letter.", id: "-LjhniMYXtRXKjP6PC6k", img: "./template/birthday.png", bgColor: "#3e3e3e"},
  {label: "Friendship", desc: "Send a letter to an old friend.", id: "-LjhomwM1So_MkMc_fPf", img: "./template/friend.png", bgColor: "#a3243d"},
  {label: "Poem", desc: "Write the poem you've always wanted to write.", id: "-LjhpUHXCr3yNB5gLE9V", img: "./template/poem.png", bgColor: "#7f644c"},
  {label: "Short Note", desc: "Send a quickie.", id: "-LjhqqTo5SuCObuUREEA", img: "./template/short.png", bgColor: "#3e3e3e"}
];

class TemplatesHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      openTutorialDialog: false
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="container" style={{width: "60%"}}>
        <TutorialDialog
          open={this.state.openTutorialDialog}
          close={() => {this.setState({openTutorialDialog: false})}}
        />
        <p className="logo">Title</p>
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
                  <div style={{backgroundColor: t.bgColor}}>
                    <div className="templateImageBox" style={{backgroundImage: "url(" + t.img + ")"}}></div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default TemplatesHome;
