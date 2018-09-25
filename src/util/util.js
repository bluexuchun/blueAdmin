import React, {Component} from 'react';
import axios from 'axios'
const qs = require('qs');
import ComLoading from '../components/ComLoading'


//所有请求地址前缀 需要修改 只要改这里就可以
export const baseUrl = 'https://blue.widiazine.cn/BLueLogistics/';

axios.defaults.baseURL = baseUrl;

// 所有文件上传 图片上传地址
export const uploadUrl = baseUrl + 'api.php?entry=sys&c=upload&a=upload';

// 封装公用的ajax方法 （不跨域）
export function ajaxTo(url,data){

  ComLoading.open()

  const requestUrl = url;
  return new Promise((resolve, reject) => {
    axios.post(requestUrl,qs.stringify(data))
    .then(function(res){
      if(res.status == 200){
        setTimeout(() => {
          ComLoading.close()
        },1000)

        resolve(res.data);

      }
    })
    .catch(function(error){
      reject(error);
    })
  })
}

// 封装专门用来解决跨域的请求
export function ajaxCors(data){

  ComLoading.open()

  const requestUrl = 'api.php?entry=sys&c=settings&a=http';
  return new Promise((resolve,reject) => {
    axios.post(requestUrl,qs.stringify(data))
    .then((res) => {
      if(res.status == 200){

        setTimeout(() => {
          ComLoading.close()
        },1000)
        resolve(res.data);

      }
    })
    .catch((error) => {
      reject(error);
    })
  })
}


const styles = {
  container:{
    width:'100%',
    height:'100%',
  },
  loading:{
    width:'100%',
    height:'100%',
    display:'flex',
    flexDirection:'colomn',
    justifyContent:'center',
    alignItems:'center',
    background:'rgba(0,0,0,0.6)',
    textAlign:'center',
    position:'fixed',
    zIndex:'999'
  },
  hide:{
    display:'none'
  }
}
