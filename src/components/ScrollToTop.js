import React, { Component } from 'react';
import {TinyButton as ScrollUpButton} from "react-scroll-up-button";

export default class ScrollToTop extends Component {
  render() {
    return (
      <ScrollUpButton
        style={{backgroundColor: "#333333", fill: "#39b287", padding: 5, outline: 'none'}}
      >
      </ScrollUpButton>
    )
  }
}
