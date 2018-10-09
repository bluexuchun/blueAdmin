import React, { Component } from 'react';
import HotcityList from './components/hotcityList';

export default class HotCityListPage extends Component {
  static displayName = 'HotCityListPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="category-list-page-page">
        <HotcityList history={this.props}/>
      </div>
    );
  }
}
