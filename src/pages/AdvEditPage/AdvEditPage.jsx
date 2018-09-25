import React, { Component } from 'react';
import AdvEdit from './components/advEdit';

export default class AdvEditPage extends Component {
  static displayName = 'AdvEditPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="adv-edit-page-page">
        <AdvEdit />
      </div>
    );
  }
}
