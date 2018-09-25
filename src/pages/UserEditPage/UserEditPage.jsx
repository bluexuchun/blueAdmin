import React, { Component } from 'react';
import UserEdit from './components/userEdit';

export default class UserEditPage extends Component {
  static displayName = 'UserEditPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="user-edit-page-page">
        <UserEdit history={this.props} />
      </div>
    );
  }
}
