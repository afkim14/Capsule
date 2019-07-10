import React, { Component } from 'react';
export const NoLinkTextMsg = () => (
  <div>
    <p className="notificationText">Please <span style={{backgroundColor: "#cecece", padding: 5, display: 'inline-block', color: '#218693'}}>highlight</span> a word for the link.</p>
  </div>
)

export const NoLinkMsg = () => (
  <div>
    <p className="notificationText">No <span style={{borderBottomStyle: 'solid', borderBottomWidth: 2, borderRadius: 1, borderBottomColor: "#cecece", paddingBottom: 1, display: 'inline-block'}}>link</span> was inputted.</p>
  </div>
)

export const InvalidImageMsg = () => (
  <div>
    <p className="notificationText">Failed to load selected file.</p>
  </div>
)

export const InvalidVideoMsg = () => (
  <div>
    <p className="notificationText">Please provide a valid video URL.</p>
  </div>
)

export const NoVideoMsg = () => (
  <div>
    <p className="notificationText">No video URL was provided.</p>
  </div>
)

export const SucessSharingMsg = () => (
  <div>
    <p className="notificationText">Your card was sent!</p>
  </div>
)

export const ErrorSharingMsg = () => (
  <div>
    <p className="notificationText">There was a problem sending your card. Please retry.</p>
  </div>
)

export const NoContentToShareMsg = () => (
  <div>
    <p className="notificationText">Please fill out recipient and body of letter.</p>
  </div>
)
