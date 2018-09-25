import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo,ajaxCors,baseUrl,uploadUrl} from '../../../../util/util';
import gdMapConfig from '../../../../util/config';
import IceContainer from '@icedesign/container';
import { Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
// 引入map组件
import Map from '../../../../components/Map'
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import {
  Input,
  Button,
  Checkbox,
  Select,
  Search,
  Menu,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload,
  Tab,
  TimePicker
} from '@icedesign/base';
import { connect } from 'react-redux'

const { Row, Col } = Grid;
const { Core } = Upload;
const { DragUpload }=Upload;
const { ImageUpload } = Upload;
const { Combobox } = Select;
const TabPane = Tab.TabPane;


const tabs = [
  { tab: "商家列表", key: 0, content: "/goodListPage"},
  { tab: "商家编辑", key: 1, content: "/goodEditPage/create"},
];


const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;



const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props} checked={checked} onChange={(currentChecked) => {
      if (props.onChange)
        props.onChange(currentChecked);
      }}/>);
};

@connect(
  state => ({user:state.user})
)

export default class SettingsForm extends Component {
  static displayName = 'CreateActivityForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      status:false,
      mapDataSource:{
        dataSource: [

        ],
        value: "",
        location:{

        }
      },
    };
  }

  componentWillMount(){
    const activityId = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=store&a=store&do=detail',{'id':activityId})
      .then((res)=>{
        console.log(res)
        let currentData = {...res};

        // 给地图初始信息
        if(res.address && res.latitude && res.longitude){

          let mapDataSource = {...this.state.mapDataSource};
          mapDataSource.location = {
            type:'change',
            name:'',
            longitude:res.longitude,
            latitude:res.latitude
          }
          this.setState({
            mapDataSource:mapDataSource
          })
        }


        currentData.ad = res.ad ? this.stringToImg(res.ad) : [];
        currentData.img = res.img ? this.stringToImg(res.img) : [];

        currentData.status = res.status == 1 ? true : false;

        // 处理经纬度
        if(res.coordinates){
          let location = res.coordinates.split(',');

          currentData.longitude = location[1];
          currentData.latitude = location[0];
        }


        this.setState({
          ...currentData,
        });

      })
    }else{
      let mapDataSource = {...this.state.mapDataSource};
      mapDataSource.location = {
        type:'init',
        name:'',
        longitude:0,
        latitude:0
      }
      this.setState({
        mapDataSource:mapDataSource
      })

      setTimeout(() => {
        // 防止输入表格无限初始化地图
        mapDataSource.location.type = 'normal';
        this.setState({
          mapDataSource:mapDataSource
        })
      },2000)

    }
  }

  componentDidMount(){

  }

  // 上传LOGO成功的回调函数
  onSuccessUpload = (type,res, file) => {
    Feedback.toast.success('上传成功');
    this.setState({
      [type]: baseUrl + res.imgURL
    })
  }

  // 上传统一图片成功回调地址
  onSuccessAll = (type,res,file) => {
    console.log(res);
    Feedback.toast.success('上传成功');
    this.setState({
      [type]:baseUrl + res.imgURL
    })
  }


  // 上传banner成功的回调函数
  onSuccessMultiple = (res, file, type) => {

    Feedback.toast.success('上传成功');

    let aryLists;

    const imgInfo = {
      name: "IMG.png",
      status: "done",
      downloadURL:baseUrl + res.imgURL,
      fileURL:baseUrl + res.imgURL,
      imgURL:baseUrl + res.imgURL
    };

    switch(type){
      case 'ad':
        if(!this.state.ad){
          aryLists = [];
        }else{
          aryLists = [...this.state.ad];
        }
        break;
      case 'img':
        if(!this.state.img){
          aryLists = [];
        }else{
          aryLists = [...this.state.img];
        }
        break;
      default:
        return false;
    }

    aryLists.push(imgInfo);

    this.setState({
      [type]: aryLists
    })
  }

  // 移除多个图片的方法
  onRemoveMultiple = (res, file, type) => {
    console.log(res,file,type)

    let newImg = [];

    let uid = res.uid;

    if(file.length > 0){
      file.map((v,i) => {
        let imgInfo = {
          name: "IMG.png",
          status: "done",
          downloadURL:baseUrl + v.imgURL,
          fileURL:baseUrl + v.imgURL,
          imgURL:baseUrl + v.imgURL
        };
        newImg.push(imgInfo)
      })
    }

    this.setState({
      [type]:newImg
    })

  }

  // 改变表单的函数
  onFormChange = (value) => {
    this.setState({value});

    let mapDataSource = {...this.state.mapDataSource};
    // 防止输入表格无限初始化地图
    mapDataSource.location.type = 'normal';
    this.setState({
      mapDataSource:mapDataSource
    })
  };

  // 图片转字符串形式
  imgToString = (ary) => {
    let convertImg = "";
    ary.map((v,i) => {
      if(convertImg == ""){
        convertImg = convertImg + v.imgURL;
      }else{
        convertImg = convertImg + "," + v.imgURL;
      }
    })

    return convertImg;
  }

  // 字符串转图片形式
  stringToImg = (str) => {
    let newStr = [];

    let stra = str.split(',');

    stra.map((v,i) => {
      let item = {
        name: "pic.png",
        fileName: "pic.png",
        status: "done",
        size: 1000,
        downloadURL:v,
        fileURL:v,
        imgURL:v
      }
      newStr.push(item);
    })

    return newStr;
  }

  // 表单提交
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {

      if(error){
        Feedback.toast.success("请填写完整信息");
        return false;
      }

      const allValue = {...this.state};

      allValue.status = allValue.status ? 1 : 0;

      delete allValue.value;
      delete allValue.mapDataSource;

      let apiurl = null;
      let dataAry = {...allValue};

      dataAry.ad = dataAry.ad ? this.imgToString(dataAry.ad) : '';
      dataAry.img = dataAry.img ? this.imgToString(dataAry.img) : '';

      if(this.props.history.params.id != 'create'){
        apiurl = 'api.php?entry=sys&c=store&a=store&do=edit';
        dataAry = {...dataAry,id:this.props.history.params.id,person:this.props.user.admin};
      }else{
        apiurl = 'api.php?entry=sys&c=store&a=store&do=add';
      }

      const result = ajaxTo(apiurl,dataAry);
      result.then(function(res){
        Feedback.toast.success(res.message);
        setTimeout(()=>{
          that.props.history.router.push('/goodListPage');
        },1500)
      })

    });
  };

  // 点击tab的函数
  tabClick = (key) => {
    const url = tabs[key].content;
    this.props.history.router.push(url);
  }


  // 富文本上传音频
  uploadMedia = (param) => {
    const serverURL = uploadUrl;
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容

    const successFn = (response) => {
      console.log(response);
      const result = eval('('+xhr.responseText+')');
      const imgUrl = result.imgURL;
      param.success({
        url: imgUrl
      })
    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('filename', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }


  // 搜索地址的结果
  onAddressSearch(value){
    const that = this;
    let mapDataSource = {...this.state.mapDataSource};
    let data = {...this.state};
    let searchUrl = 'https://restapi.amap.com/v3/geocode/geo?address='+value.key+'&output=JSON&key='+gdMapConfig.key;
    let result = ajaxCors({url:searchUrl})
    .then((res) => {
      if(res.status == 1){
        console.log(res);
        // 先做一个结果的
        const data = res.geocodes[0];
        let location = data.location.split(',');
        mapDataSource.location = {
          type:'change',
          name:value.key,
          longitude:location[0],
          latitude:location[1]
        }
        mapDataSource.value = value.key;


        that.setState({
          longitude: location[0],
          latitude: location[1],
          address: value.key,
          mapDataSource: mapDataSource
        })

      }
    })
  }

  // 搜索变化 自动根据输入的地址去搜索相关信息
  onAddressChange(value){
    const isEnglish = /^[a-zA-Z]*$/.test(value);
    if(!isEnglish){
      const that = this;
      setTimeout(() => {
        let url = 'https://restapi.amap.com/v3/assistant/inputtips?key='+gdMapConfig.key+'&keywords='+value+'&type=&location=&city=&datatype=all';
        let mapSource = {...this.state.mapDataSource};
        mapSource.dataSource = [];
        let result = ajaxCors({url:url})
        .then((res) => {
          if(res.status == 1){
            const data = res.tips;
            if(data.length > 0){
              for (var i in data) {
                let dataInfo = {
                  label: data[i].district + data[i].name,
                  value: data[i].district + data[i].name
                }
                mapSource.dataSource.push(dataInfo);
              }
            }else{
              let dataInfo = {
                label: '没搜索到相关信息...',
              }
              mapSource.dataSource.push(dataInfo);
            }
            that.setState({
              mapDataSource:mapSource
            })
          }
        })
      },500)
    }
  }


  // 地图组件改变完成 无需在做变化
  onMapNormal(){
    let mapDataSource = {...this.state.mapDataSource};
    mapDataSource.location.type = 'normal';
    this.setState({
      mapDataSource:mapDataSource
    })
  }

  // 修改时间
  changeTime = (type,date,formatDate) => {
    this.setState({
      [type]:formatDate
    })
  }


  render() {

    // Combobox的配置
    const comboboxConfig = {
      size:'large',
      mutiple:false,
      hasArrow:true,
      disabled:false,
    }


    return (
      <div className="create-activity-form">
        <IceContainer style={styles.container}>
          <IceFormBinderWrapper
            ref={(formRef) => {
              this.formRef = formRef;
            }}
            value={this.state}
            onChange={this.onFormChange}
          >
            <div>
              <Tab onChange={this.tabChange} defaultActiveKey={1}>
                {tabs.map(item => (
                  <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

                  </TabPane>
                ))}
              </Tab>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家名称：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="store_name" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }}
                      placeholder="请输入商家名称"/>
                  </IceFormBinder>
                  <IceFormError name="store_name"/>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家电话：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="tel" required={false}>
                    <Input style={{
                        width: '100%'
                      }}
                      placeholder="请输入商家电话"/>
                  </IceFormBinder>
                  <IceFormError name="tel"/>
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家LOGO：
                </Col>
                <Col s="12" l="10">
                    <Upload
                      style={{
                        display: "block",
                        textAlign: "center",
                        width: "320px",
                        height: "180px",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "12px"
                      }}
                      action={uploadUrl}
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                      name="filename"
                      beforeUpload={this.beforeUpload}
                      onSuccess={(res,file) => this.onSuccessAll('logo',res,file)}
                    >
                      {this.state.logo ?
                        <Img
                          width={320}
                          height={180}
                          src={this.state.logo}
                          type="cover"
                          style={{
                            borderRadius:"5px"
                          }}
                        />
                        :
                        <div style={{ width:"320px",height:"180px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",border:"1px dashed #aaa",borderRadius:"5px"}}>
                          <div style={{ color:"#3080FE",fontSize:"30px",width:"100%",textAlign:"center"}}>+</div>
                          <div style={{ color:"#3080FE",fontSize:"14px",width:"100%",textAlign:"center"}}>上传图片</div>
                        </div>
                      }
                    </Upload>
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家轮播图：
                </Col>
                <Col s="12" l="18">
                  <ImageUpload
                    listType="picture-card"
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    locale={{
                      image: {
                        cancel: "取消上传",
                        addPhoto: "上传图片"
                      }
                    }}
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res,file) => this.onSuccessMultiple(res,file,'ad')}
                    onRemove={(res,file) => this.onRemoveMultiple(res,file,'ad')}
                    onError={this.onError}
                    fileList={this.state.ad}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家图片：
                </Col>
                <Col s="12" l="18">
                  <ImageUpload
                    listType="picture-card"
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    locale={{
                      image: {
                        cancel: "取消上传",
                        addPhoto: "上传图片"
                      }
                    }}
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res,file) => this.onSuccessMultiple(res,file,'img')}
                    onRemove={(res,file) => this.onRemoveMultiple(res,file,'img')}
                    onError={this.onError}
                    fileList={this.state.img}
                  />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公告：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="announcement" required={false}>
                    <Input style={{
                        width: '100%'
                      }}
                      placeholder="请输入公告"/>
                  </IceFormBinder>
                  <IceFormError name="announcement"/>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  营业开始时间：
                </Col>

                <Col s="12" l="10">
                  <TimePicker size="large" format="HH:mm" value={this.state.start_time} onChange={this.changeTime.bind(this,'start_time')}/>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  营业结束时间：
                </Col>

                <Col s="12" l="10">
                  <TimePicker size="large" format="HH:mm" value={this.state.end_time} onChange={this.changeTime.bind(this,'end_time')}/>
                </Col>
              </Row>

              <Row>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家地址：
                </Col>

                <Col s="12" l="16">
                  <Row>
                    <IceFormBinder type="string" name="address" required={false} message="商家地址必须填写">
                      <Search
                        onSearch={this.onAddressSearch.bind(this)}
                        onChange={this.onAddressChange.bind(this)}
                        dataSource={this.state.mapDataSource.dataSource}
                        searchText="搜索地址"
                        autoWidth
                      />
                    </IceFormBinder>
                    <IceFormError name="address"/>
                  </Row>
                  <Row>
                      <Map style={styles.mapStyle} mapSource={this.state.mapDataSource} mapNormal={this.onMapNormal.bind(this)}></Map>
                  </Row>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col s="12" l="12" style={styles.formLabel}>
                  <Row style={styles.formItem}>
                    <Col s="4" l="8">商家经度：</Col>
                    <Col s="12" l="12">
                      <IceFormBinder name="longitude" required={false} message="公司经度必须填写">
                        <Input style={{
                              width: '100%'
                            }}
                            disabled/>
                      </IceFormBinder>
                      <IceFormError name="longitude"/>
                    </Col>
                  </Row>
                </Col>
                <Col s="12" l="12" style={styles.formLabel}>
                  <Row style={styles.formItem}>
                    <Col s="4" l="8">商家纬度：</Col>
                    <Col s="12" l="12">
                      <IceFormBinder name="latitude" required={false} message="公司纬度必须填写">
                        <Input style={{
                              width: '100%'
                            }}
                            disabled/>
                      </IceFormBinder>
                      <IceFormError name="latitude"/>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  状态：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="status">
                    <SwitchForForm defaultValue={this.state.status}/>
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  关键字：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="keyword" required={false}>
                    <Input style={{
                        width: '100%'
                      }}
                      placeholder="请输入仓储特色"/>
                  </IceFormBinder>
                  <IceFormError name="keyword"/>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  人气数：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="views" required={false}>
                    <Input style={{
                        width: '100%'
                      }}
                      placeholder="请输入人气数"/>
                  </IceFormBinder>
                  <IceFormError name="views"/>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家排序：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="displayorder" required={false}>
                    <Input style={{
                        width: '100%'
                      }}
                      placeholder="数字越小越靠前"/>
                  </IceFormBinder>
                  <IceFormError name="displayorder"/>
                </Col>
              </Row>

              <Row style={styles.formText}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家简介：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="intro" required={false}>
                    <Input style={{
                        width: '100%'
                      }} multiple placeholder="请输入商家简介"
                      />
                  </IceFormBinder>
                  <IceFormError name="intro"/>
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  商家二维码图片：
                </Col>
                <Col s="12" l="10">
                    <Upload
                      style={{
                        display: "block",
                        textAlign: "center",
                        width: "320px",
                        height: "180px",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "12px"
                      }}
                      action={uploadUrl}
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                      name="filename"
                      beforeUpload={this.beforeUpload}
                      onSuccess={(res,file) => this.onSuccessAll('ewm_logo',res,file)}
                    >
                      {this.state.ewm_logo ?
                        <Img
                          width={320}
                          height={180}
                          src={this.state.ewm_logo}
                          type="cover"
                          style={{
                            borderRadius:"5px"
                          }}
                        />
                        :
                        <div style={{ width:"320px",height:"180px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",border:"1px dashed #aaa",borderRadius:"5px"}}>
                          <div style={{ color:"#3080FE",fontSize:"30px",width:"100%",textAlign:"center"}}>+</div>
                          <div style={{ color:"#3080FE",fontSize:"14px",width:"100%",textAlign:"center"}}>上传图片</div>
                        </div>
                      }
                    </Upload>
                </Col>
              </Row>

              <Row style={styles.btns}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>

                </Col>
                <Col s="12" l="10">
                  <Button type="primary" onClick={this.submit}>
                    {this.props.history.params.activityId != 'create' ? '保存' : '立即创建'}
                  </Button>
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    paddingBottom: 0
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formText: {
    marginBottom: '25px'
  },
  imgPadding:{
    paddingBottom:'25px'
  },
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  resetBtn: {
    marginLeft: '20px'
  },
  richItem:{
    marginBottom:'25px'
  },
  richText: {
    border:'1px solid #DCDEE3',
    borderRadius:'4px',
    width:'100%',
    boxShadow:'0 10px 20px rgba(0,0,0,0.1)'
  },
  mapStyle: {
    width:'100%',
    height:'500px',
    marginTop:'25px',
    marginBottom:'25px'
  }
};
