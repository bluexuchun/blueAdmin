import React, { Component } from 'react';
import GoodEdit from './components/goodEdit';

export default class GoodEditPage extends Component {
  static displayName = 'GoodEditPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="good-edit-page-page">
        <GoodEdit history={this.props}/>
      </div>
    );
  }
}
