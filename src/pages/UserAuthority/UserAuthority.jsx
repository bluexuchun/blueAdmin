import React, { Component } from 'react';
import AuthorityTable from './components/AuthorityTable';

export default class UserAuthority extends Component {
  static displayName = 'UserAuthority';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="user-authority-page">
        <AuthorityTable />
      </div>
    );
  }
}
