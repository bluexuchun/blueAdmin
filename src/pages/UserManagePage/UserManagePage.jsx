import React, { Component } from 'react';
import UserManage from './components/userManage';

export default class UserManagePage extends Component {
  static displayName = 'UserManagePage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="user-manage-page-page">
        <UserManage />
      </div>
    );
  }
}
