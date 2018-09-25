import React, { Component } from 'react';
import GoodList from './components/goodList';

export default class GoodListPage extends Component {
  static displayName = 'GoodListPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="good-list-page-page">
        <GoodList />
      </div>
    );
  }
}
