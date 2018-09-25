import React, { Component } from 'react';
import CategoryList from './components/categoryList';

export default class CategoryListPage extends Component {
  static displayName = 'CategoryListPage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="category-list-page-page">
        <CategoryList history={this.props}/>
      </div>
    );
  }
}
