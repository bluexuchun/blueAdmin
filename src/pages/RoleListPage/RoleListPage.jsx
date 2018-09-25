import React, { Component } from 'react';
import RoleList from './components/roleList';

export default class RoleListPage extends Component {
  static displayName = 'RoleListPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="role-list-page-page">
        <RoleList history={this.props}/>
      </div>
    );
  }
}
