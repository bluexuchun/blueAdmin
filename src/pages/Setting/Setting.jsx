import React, { Component } from 'react';
import SettingsForm from './components/SettingsForm';

export default class Setting extends Component {
  static displayName = 'Setting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="setting-page">
        <SettingsForm />
      </div>
    );
  }
}
