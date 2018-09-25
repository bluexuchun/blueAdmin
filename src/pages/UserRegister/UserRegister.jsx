import React, { Component } from 'react';
import Register from './components/Register';

export default class UserRegister extends Component {
  static displayName = 'UserRegister';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="user-register-page">
        <Register history={this.props}/>
      </div>
    );
  }
}
