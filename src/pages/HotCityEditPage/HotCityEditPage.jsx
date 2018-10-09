import React, { Component } from 'react';
import HotcityEdit from './components/hotcityEdit';

export default class HotCityEditPage extends Component {
  static displayName = 'HotCityEditPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="category-edit-page-page">
        <HotcityEdit history={this.props}/>
      </div>
    );
  }
}
