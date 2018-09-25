import React, { Component } from 'react';
import LandingIntroBanner from './components/LandingIntroBanner';
import { connect } from 'react-redux';
import { isLogin } from '../../store/user.redux';
import cookie from 'react-cookies';

@connect(
  state=>({user:state.user}),
  {isLogin}
)

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {



  }
  render() {
    return (
      <div className="home-page">
        <LandingIntroBanner />
      </div>
    );
  }
}
