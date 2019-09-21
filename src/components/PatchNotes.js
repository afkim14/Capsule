import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Utils from '../constants/utils';

const BASE_URL = Utils.getBaseURL() + "/cards/";
const patchNotes = [
  {
    title: 'Patch 1.2: After Second Iteration',
    date: 'July 29th, 2019',
    text: 'New colors, Header-creating shortcut, and general bug fixes.',
    cardID: '-Ll2q5Jg2xt6UIbI4oc5',
    password: 'patchnotes'
  },
  {
    title: 'Patch 1.1: After First Iteration',
    date: 'July 19th, 2019',
    text: 'In this patch, we have fixed generals bugs with the text editor, included some convenience functionalities, revamped fonts and colors, and included new content!',
    cardID: '-LkMsxveZ27iTHdUQ4Nc',
    password: 'password'
  }
]

class PatchNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="nonEditorContainer" style={{marginTop: 10}}>
        {
          patchNotes.map((p, i) => {
            return (
              <div key={i}>
                <p className="logo patchHeader" style={{fontSize: 20}} onMouseDown={()=>{Utils.openInNewTab(BASE_URL + p.cardID + "/" + p.password)}}>{p.title}</p>
                <p className="logoSubtext" style={{marginTop: 2, fontSize: 18}}>{p.date}</p>
                <p className="logoSubtext" style={{fontStyle: 'italic', fontSize: 18}}>{p.text}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default PatchNotes;
