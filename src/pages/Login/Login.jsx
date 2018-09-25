import React, { Component } from 'react';
import UserLogin from './components/UserLogin';

export default class Login extends Component {
  static displayName = 'Login';

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div className="login-page">
        <UserLogin child={this.props} />
      </div>
    );
  }
}
