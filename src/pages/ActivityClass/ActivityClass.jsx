import React, { Component } from 'react';
import CreateActivityClass from './components/CreateActivityClass';

export default class ActivityClass extends Component {
  static displayName = 'ActivityClass';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="activity-class-page">
          <CreateActivityClass history={this.props} />
      </div>
    );
  }
}
