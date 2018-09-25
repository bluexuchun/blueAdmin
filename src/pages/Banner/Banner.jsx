import React, { Component } from 'react';
import CreateBanner from './components/CreateBanner';

export default class Banner extends Component {
  static displayName = 'Banner';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateBanner history={this.props} />
      </div>
    );
  }
}
