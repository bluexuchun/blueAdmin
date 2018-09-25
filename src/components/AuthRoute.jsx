import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { isLogin } from '../store/user.redux'
import { display } from '../store/setting.redux'

@connect(
  state=>({user:state.user}),
  {isLogin,display}
)

class AuthRoute extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // 进行授权操作
    this.props.isLogin();
    if(this.props.user.login){
      this.props.history.push('/home');
    }else{
      this.props.history.push('/login');
    }
  }
  render () {
    return null
  }
}

export default withRouter(AuthRoute);
