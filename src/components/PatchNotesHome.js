import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Utils from '../constants/utils';

const BASE_URL = Utils.getBaseURL() + "/cards/";
const patchNotes = [
  {
    title: 'Patch 1.1: After First Iteration',
    date: 'July 19th, 2019',
    text: 'In this patch, we have fixed generals bugs with the text editor, included some convenience functionalities, revamped fonts and colors, and included new content!',
    cardID: '-LkMsxveZ27iTHdUQ4Nc',
    password: 'password'
  }
]

class PatchNotesHome extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="container">
        <Link style={{textDecoration: 'none'}} to="/">
          <p className="logo">Capsule</p>
        </Link>
        <div style={{clear: 'both'}}/>
        {
          patchNotes.map((p, i) => {
            return (
              <div key={i}>
                <p className="logo patchHeader" onMouseDown={()=>{Utils.openInNewTab(BASE_URL + p.cardID + "/" + p.password)}}>Patch 1.1: After First Iteration</p>
                <p className="logoSubtext" style={{marginTop: 2}}>July 19th, 2019</p>
                <p className="logoSubtext" style={{fontStyle: 'italic'}}>In this patch, we have fixed generals bugs with the text editor, included some convenience functionalities, revamped fonts and colors, and included new content!</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default PatchNotesHome;
