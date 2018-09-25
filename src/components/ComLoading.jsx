import React, {Component} from 'react';
import { Link } from 'react-router';
import { Loading } from "@icedesign/base";


export default class ComLoading extends Component {
  constructor(props){

    super(props);
    this.state = {
      visible:true
    }

  }

  render() {
    return (
      <div style={styles.container}>

        {
          this.state.visible ?

          <div style={styles.loading}>
            <Loading shape="dot-circle">

            </Loading>
          </div> : null
        }

      </div>
    );
  }
}


/**
// by Xuchun
// loading效果
// 直接通过ComLoading.open()打开
// ComLoading.close()关闭
**/

// 扩展方法 通过appendChild & React.createElement创建loading

ComLoading.open = function newOpen() {
  if(!document.getElementById("loadingId")){
    let div = document.createElement('div');
    div.style = "width:100%;height:100%;position:fixed;top:0;left:0;z-index:999";
    div.id = 'loadingId';
    document.body.appendChild(div);
    ReactDOM.render(React.createElement(ComLoading, {}), div);
  }
}


// 再通过unmountComponentAtNode & removeChild移除loading

ComLoading.close = function newClose() {
  if(document.getElementById('loadingId')){
    ReactDOM.unmountComponentAtNode(document.getElementById('loadingId'));
    document.body.removeChild(document.getElementById('loadingId'));
  }
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
