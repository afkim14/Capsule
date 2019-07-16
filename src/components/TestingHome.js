import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import TestingDialog from './TestingDialog';

class TestingHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTestingDialog: true
    }
  }

  render() {
    if (this.state.openTestingDialog) {
      return (
        <TestingDialog
          open={this.state.openTestingDialog}
          close={() => {this.setState({openTestingDialog: false})}}
        />
      )
    } else {
      return (
        <Redirect push to="/" />
      )
    }
  }
}

export default TestingHome;
