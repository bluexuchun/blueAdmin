import { Feedback } from '@icedesign/base';
import { ajaxTo } from '../util/util';

const DISPLAY = 'DISPLAY';
const ERROR = 'ERROR';
const EDIT = 'EDIT';

const initState = {

}

export function settingDate(state=initState,action){
  switch(action.type){
    case DISPLAY:
      return {...state,msg:'获取成功',...action.payload}
    case ERROR:
      return {...state,msg:'获取失败'}
    default:
      return state
  }
}

function getSuccess(obj){
  return {type:DISPLAY,payload:obj}
}

function error(){
  return {type:ERROR}
}

export function display(){

  return dispatch => {
    const result = ajaxTo('api.php?entry=sys&c=system&a=setting&do=display',{});
    result.then(function(res){
      if(res.status == 1){
        console.log(res);
        dispatch(getSuccess(res.data));
      }else{
        Feedback.toast.error('获取信息失败');
        dispatch(error());
      }
    })
  }
}

export function edit(obj){
  return dispatch => {
    const result = ajaxTo('api.php?entry=sys&c=system&a=setting&do=edit',obj);
    result.then(function(res){
      if(res.status == 1){
        Feedback.toast.success(res.message);
        dispatch(getSuccess(obj));
      }else{
        Feedback.toast.success(res.message);
        dispatch(error());
      }

    })
  }
}
