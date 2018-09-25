import React, { Component } from 'react';
import CategoryEdit from './components/categoryEdit';

export default class CategoryEditPage extends Component {
  static displayName = 'CategoryEditPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="category-edit-page-page">
        <CategoryEdit history={this.props}/>
      </div>
    );
  }
}
