import React, {Component} from 'react';
import axios from 'axios';
import uploadUrl,{ajaxTo} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import { Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
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
import '../../Company.scss';

const { Row, Col } = Grid;
const { Core } = Upload;
const { DragUpload }=Upload;
const { ImageUpload } = Upload;
const { Combobox } = Select;
const TabPane = Tab.TabPane;


const tabs = [
  { tab: "公司列表", key: 0, content: "/activityList"},
  { tab: "公司编辑", key: 1, content: "/activity/"},
  { tab: "公司审核", key: 2, content: "/company"}
];


export default class CreateActivityForm extends Component {
  static displayName = 'CreateActivityForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount(){

  }

  componentDidMount(){
    const id = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    if(id != 'create'){
      ajaxTo('api.php?entry=sys&c=company&a=edit&do=display',{'id':id})
      .then((res)=>{
        let currentData = {...res};

        this.setState({
          ...currentData
        });

      })
    }else{
      const allClass = this.state;
    }
  }


  // 改变表单的函数
  onFormChange = (value) => {
    this.setState({value});
  };




  // 表单提交
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {

      const allValue = {...that.formRef.props.value};
      const isChecked = allValue.is_checked;

      const data = {is_checked:isChecked,id:allValue.id};

      const result = ajaxTo('api.php?entry=sys&c=authenticate&a=edit&do=check',data);
      result.then(function(res){
        console.log(res)
        if(res.status == 1){
          Feedback.toast.success('保存成功');
          setTimeout(()=>{
            that.props.history.router.push('/activityList');
          },1500)
        }
      })
    });
  };

  // 点击tab的函数
  tabClick = (key) => {
    const id = this.props.history.params.id;
    if(key != 2){
      let url = tabs[key].content;
      if(key == 1){
        url = url + id;
      }
      this.props.history.router.push(url);
    }
  }

  // 切换选项的时候
  selectChange = (value,option) => {
    console.log(value);
    console.log(this.state);
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
              <Tab onChange={this.tabChange} defaultActiveKey={2}>
                {tabs.map(item => (
                  <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

                  </TabPane>
                ))}
              </Tab>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  企业信息：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="info" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="info"/>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  企业名称：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="name" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="name"/>
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  注册地址：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="re_address" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="re_address"/>
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司地址：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="address" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="address"/>
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  法人姓名：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="legal_person" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="legal_person"/>
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  法人身份证号：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="identify_number" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="identify_number"/>
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  联系人：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="linkman" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="linkman"/>
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  联系电话：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="phone" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%'
                      }} disabled={true}/>
                  </IceFormBinder>
                  <IceFormError name="phone"/>
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col  xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司LOGO：
                </Col>
                <Col s="12" l="10">
                  <Img
                    width={120}
                    height={120}
                    src={this.state.logo_path}
                    type="cover"
                    style={{
                      borderRadius:"5px"
                    }}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col  xxs="6" s="2" l="4" style={styles.formLabel}>
                  营业执照：
                </Col>
                <Col s="12" l="10">
                  <Img
                    width={320}
                    height={180}
                    src={this.state.license_path}
                    type="cover"
                    style={{
                      borderRadius:"5px"
                    }}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col  xxs="6" s="2" l="4" style={styles.formLabel}>
                  法人身份证：
                </Col>
                <Col s="12" l="18">
                  <Img
                    width={320}
                    height={180}
                    src={this.state.positive_path}
                    type="cover"
                    style={{
                      borderRadius:"5px",
                      display: "inline-block",
                      marginRight: "15px"
                    }}
                  />
                  <Img
                    width={320}
                    height={180}
                    src={this.state.reverse_path}
                    type="cover"
                    style={{
                      borderRadius:"5px",
                      display: "inline-block"
                    }}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col  xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司门头照片：
                </Col>
                <Col s="12" l="10">
                  <Img
                    width={320}
                    height={180}
                    src={this.state.facade_path}
                    type="cover"
                    style={{
                      borderRadius:"5px"
                    }}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col  xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司前台照片：
                </Col>
                <Col s="12" l="10">
                  <Img
                    width={320}
                    height={180}
                    src={this.state.reception_path}
                    type="cover"
                    style={{
                      borderRadius:"5px"
                    }}
                  />
                </Col>
              </Row>


              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  审核情况：
                </Col>
                <Col s="18" l="18">
                  <IceFormBinder name="is_checked" required={false} message="公司名称必须填写">
                    <Select
                      size="large"
                      placeholder="选择尺寸"
                      onChange={this.selectChange}
                      defaultValue={this.is_checked}
                    >
                      <Option value="0">未审核</Option>
                      <Option value="1">审核通过</Option>
                      <Option value="2">审核失败</Option>
                    </Select>
                  </IceFormBinder>
                  <IceFormError name="is_checked"/>
                </Col>
              </Row>



              <Row style={styles.btns}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>

                </Col>
                <Col s="12" l="10">
                  <Button type="primary" onClick={this.submit}>
                    保存
                  </Button>
                  <Button style={styles.resetBtn} onClick={this.reset}>
                    重置
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
  }
};
