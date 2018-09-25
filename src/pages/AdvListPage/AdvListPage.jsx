import React, { Component } from 'react';
import AdvList from './components/advList';

export default class AdvListPage extends Component {
  static displayName = 'AdvListPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="adv-list-page-page">
        <AdvList />
      </div>
    );
  }
}
