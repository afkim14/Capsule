import React, { Component } from 'react';
import { ContentState, convertFromRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';


class ViewerHome extends Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    // read data from database
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default ViewerHome;
