import React, {Component} from 'react';
import axios from 'axios';
import {baseUrl,uploadUrl,ajaxTo,ajaxCors} from '../../../../util/util';
import gdMapConfig from '../../../../util/config';
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
const { Combobox } = Select;

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "热门城市列表", key: 0, content: "/hotCityListPage"},
  { tab: "热门城市编辑", key: 1, content: "/hotCityEditPage/cityId"},
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

export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      status: false,
      provinceList:[]
    };
  }

  componentWillMount(){
    const that = this;
    const activityId = this.props.history.params.cityId;

    let provinceList = [...that.state.provinceList];
    // 获取城市
    const province = ajaxTo('api.php?entry=app&c=logistics&a=company&do=city',{})
    .then((res) => {
      let allData = res.data;
      for (var v in allData) {
        if(allData[v]){
          allData[v].map((vi,ii) => {
            provinceList.push(vi)
          })
        }
      }
    })

    this.setState({
      provinceList
    })

    // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=logistics&a=city_hot&do=detail',{'id':activityId})
      .then((res)=>{
        console.log(res);
        this.setState({...res});
      })
    }
  }

  componentDidMount(){

  }

  onFormChange = (value) => {
    this.setState({value});
  }

  onInputUpdate(value) {
    console.log(value);
  }

  onInputBlur(e, value) {
    console.log("blur", value);
  }

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(this.props);
    this.props.history.router.push(url);
  }

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {
        return false;
      }
      console.log(this.props);
      //修改区
      const newrequestUrl=this.props.history.params.cityId=='create'?'api.php?entry=sys&c=logistics&a=city_hot&do=add':'api.php?entry=sys&c=logistics&a=city_hot&do=edit';

      delete value.value;

      value.status = value.status ? 1 : 0;


      const result =ajaxTo(newrequestUrl, {...value});

      result.then(function(res) {
        console.log(res);
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);

        setTimeout(function(){
          that.props.history.router.push('/hotCityListPage');
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
                城市的选择：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="name" required={true} message="必须选择热门城市">
                  <Combobox
                    hasArrow={true}
                    onInputBlur={this.onInputBlur.bind(this)}
                    onInputUpdate={this.onInputUpdate.bind(this)}
                    dataSource={this.state.provinceList}
                    style={{width:'100%'}}
                    placeholder="请选择热门城市"
                  >
                  </Combobox>
                </IceFormBinder>
                <IceFormError name="name"/>
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
