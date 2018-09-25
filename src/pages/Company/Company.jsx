import React, { Component } from 'react';
import CompanyStatus from './components/CompanyStatus';

export default class Company extends Component {
  static displayName = 'Company';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="company-page">
        <CompanyStatus history={this.props}/>
      </div>
    );
  }
}
