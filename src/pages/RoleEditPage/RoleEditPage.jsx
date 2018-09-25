import React, { Component } from 'react';
import RoleEdit from './components/roleEdit';
import axios from 'axios';
import uploadUrl,{ajaxTo,ajaxCors} from '../../util/util';

export default class RoleEditPage extends Component {
  static displayName = 'RoleEditPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className="role-edit-page-page">
        <RoleEdit history={this.props}/>
      </div>
    );
  }
}
