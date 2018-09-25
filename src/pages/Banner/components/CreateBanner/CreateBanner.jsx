import React, {Component} from 'react';
import axios from 'axios';
import {baseUrl,uploadUrl,ajaxTo} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import { Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload,
  Tab
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "轮播图列表", key: 0, content: "/bannerList"},
  { tab: "轮播图编辑", key: 1, content: "/banner/bannercreate"},
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

export default class CreateBanner extends Component {
  static displayName = 'CreateBanner';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      img_path:'',
      status: false,
    };
  }

  componentWillMount(){
    console.log(uploadUrl);
    const activityId = this.props.history.params.activityId;
    // 正确获取到activityId的值，去获取他的值
    if(activityId != 'bannercreate'){
      ajaxTo('api.php?entry=sys&c=logistics&a=banner&do=detail',{'id':activityId})
      .then((res)=>{
        this.setState({...res});
      })
    }
  }

  componentDidMount(){

  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = res.imgURL;
    this.setState({
      'img_path': logoImg
    })
  }

  onFormChange = (value) => {
    this.setState({value});
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    this.props.history.router.push(url);
  }

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {
        return false;
      }

      //修改区
      const newrequestUrl=this.props.history.params.activityId=='bannercreate'?'api.php?entry=sys&c=logistics&a=banner&do=add':'api.php?entry=sys&c=logistics&a=banner&do=edit';

      delete value.value;

      value.status = value.status ? 1 : 0;


      const result =ajaxTo(newrequestUrl, {...value});

      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);

        setTimeout(function(){
          that.props.history.router.push('/bannerList');
        },1000);

      }, function(value) {
        //这是错误请求返回的信息
      })

    });
  };

  render() {
    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state} onChange={this.onFormChange}>
          <div>
            <Tab onChange={this.tabChange} defaultActiveKey={1}>
              {tabs.map(item => (
                <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

                </TabPane>
              ))}
            </Tab>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                链接：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="url" required={false}>
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="url"/>
              </Col>
            </Row>


            <Row style={styles.imgPadding}>
              <Col  xxs="6" s="2" l="2" style={styles.formLabel}>
                封面图：
              </Col>
              <Col s="12" l="10">
                  <Upload
                    style={{
                      display: "block",
                      textAlign: "center",
                      width: "120px",
                      height: "120px",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "12px"
                    }}
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                  >
                  {this.state.img_path ?
                    <Img
                      width={120}
                      height={120}
                      src={baseUrl + this.state.img_path}
                      type="cover"
                      style={{
                        borderRadius:"5px"
                      }}
                    />
                    :
                    <div style={{ width:"120px",height:"120px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",border:"1px dashed #aaa",borderRadius:"5px"}}>
                      <div style={{ color:"#3080FE",fontSize:"30px",width:"100%",textAlign:"center"}}>+</div>
                      <div style={{ color:"#3080FE",fontSize:"14px",width:"100%",textAlign:"center"}}>上传图片</div>
                    </div>
                  }
                </Upload>
              </Col>
            </Row>


            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                排序：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="displayorder" required={false}>
                  <Input style={{
                      width: '100%'
                    }}
                    placeholder="数字越小越靠前"
                    />
                </IceFormBinder>
                <IceFormError name="displayorder"/>
              </Col>
            </Row>



            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.status}/>
                </IceFormBinder>
              </Col>
            </Row>


            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.activityId != 'bannercreate' ? '保存' : '立即创建'}
                </Button>
              </Col>
            </Row>
          </div>
        </IceFormBinderWrapper>
      </IceContainer>
    </div>);
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
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  resetBtn: {
    marginLeft: '20px'
  },
  imgPadding:{
    paddingBottom:'25px'
  },
};
