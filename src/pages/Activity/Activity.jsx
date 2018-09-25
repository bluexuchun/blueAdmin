import React, { Component } from 'react';
import CreateActivityForm from './components/CreateActivityForm';


export default class Activity extends Component {
  static displayName = 'Activity';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateActivityForm history={this.props}/>
      </div>
    );
  }
}
