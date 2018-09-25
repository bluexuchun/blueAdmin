import { Feedback } from '@icedesign/base';
import { ajaxTo } from '../util/util';
import cookie from 'react-cookies';
import ComLoading from '../components/ComLoading';

const LOGIN = 'LOGIN';
const REGISTER = 'REGISTER';
const ERROR = 'ERROR';
const QUIT = 'QUIT';

const initState = {
  login:false
}

//
export function user(state=initState,action){
  switch(action.type){
    case LOGIN:
      return {...state,login:true,msg:'登录成功',...action.payload}
    case REGISTER:
      return {...state,msg:action.msg}
    case ERROR:
      return {...state,msg:'登录失败'}
    case QUIT:
      return {...initState,login:false,msg:'退出登录'}
    default:
      return state
  }
}

function authSuccess(obj){
  return {type:LOGIN,payload:obj}
}

function error(){
  return {type:ERROR}
}

// 退出登录
function quit(){
  return {type:QUIT}
}

// 登录操作
export function login(obj){
  console.log(obj);
  const data = {
    'name':obj.account,
    'password':obj.password
  }
  return dispatch => {
    const result = ajaxTo('api.php?entry=sys&c=login&a=login',data);
    result.then(function(res) {
      if(res.status == 1){
        Feedback.toast.success('登录成功!');
        cookie.save('isLogin',true);
        cookie.save('userInfo',res.data);
        dispatch(authSuccess(res.data));
      }else{
        Feedback.toast.error(res.message);
        dispatch(error());
      }
    }, function(value) {
      // failure
    });
  }
}

export function isLogin(){
  const isLogin = cookie.load('isLogin');
  if(isLogin){
    Feedback.toast.success('登录成功!');
    const userInfo = cookie.load('userInfo');
    return dispatch => {
      dispatch(authSuccess(userInfo));
    }
  }else{
    return dispatch => {
      dispatch(error());
    };
  }
}

export function quitmethod(){
  cookie.remove('isLogin');
  cookie.remove('userInfo');
  return dispatch => {
    dispatch(quit());
  }
}
