import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import qqMapConfig from '../util/config';

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      location:{
        name:'',
        longitude:0,
        latitude:0
      }
    }
  }
  componentWillMount() {

  }

  componentWillReceiveProps (nextProps) {
    let location = this.state.location;

    let latitude = nextProps.mapSource.location.latitude;
    let longitude = nextProps.mapSource.location.longitude;
    let name = nextProps.mapSource.location.name;
    let type = nextProps.mapSource.location.type;

    location.longitude = nextProps.mapSource.location.longitude;
    location.latitude = nextProps.mapSource.location.latitude;
    location.name = name;

    if(type == 'init'){
      this.initMap({
        type:type,
      })
    }else if(type == 'change'){
      this.initMap({
        type:type,
        name:name,
        latitude:latitude,
        longitude:longitude
      })
    }

    this.setState({
      location:location
    });
  }
  componentDidMount(){
    this.initMap({type:'init'});
  }

  initMap(value){
    let map = new AMap.Map(this.refs.mapComponent,{
      resizeEnable: true,
      zoom:11,
    });
    // 添加工具栏
    AMap.plugin('AMap.ToolBar',function(){//异步加载插件
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
    });
    if(value.type == 'init'){
      map.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', (res)=>{

        });//返回定位信息
        AMap.event.addListener(geolocation, 'error', (error)=>{

        });      //返回定位出错信息
      });
    }else if(value.type == 'change'){
      // 坐标
      console.log(value);
      if(value.latitude > 0 || value.longitude > 0){
        var marker = new AMap.Marker({
            position: new AMap.LngLat(value.longitude, value.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: value.name
        });
        // 将创建的点标记添加到已有的地图实例：
        map.add(marker);
        map.panTo([value.longitude, value.latitude]);
        map.setZoom(18)
      }
      this.props.mapNormal();
    }
  }


  render () {
    return (
      <div ref="mapComponent" style={this.props.style}></div>
    )
  }
}

export default withRouter(Map);
