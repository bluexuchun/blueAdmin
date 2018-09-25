import React, {Component} from 'react';
import axios from 'axios';
import uploadUrl,{ajaxTo, ajaxCors, addData} from '../../../../util/util';
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
  Tab,
  Table,
  Dialog
} from '@icedesign/base';
import { connect } from 'react-redux'

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "返回", key: 0, content: ""},
  { tab: "路线编辑", key: 1, content: "/activityClass"},
];


// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

// Switch 组件的选中等 props 是 checked 不符合表单规范的 value 在此做转换
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

export default class CreateActivityClass extends Component {
  static displayName = 'CreateActivityClass';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      provinceList:[],
      o_cityList:[],
      o_areaList:[],
      d_cityList:[],
      d_areaList:[],

      // 重货价
      weight_visible:false,
      weight_price:[],
      weight_item:{
        yl:'',
        price:''
      },
      weight_type:'insert',
      // 轻货价
      light_visible:false,
      light_price:[],
      light_item:{
        yl:'',
        price:''
      },
      light_type:'insert',
      // 单位
      unitAry:[
        '公斤',
        '斤'
      ],
      // 发车频率
      car_num:{
        day:'',
        num:''
      },
      // 座机号码
      landline:[{

      }],
      // 联系人
      lineContact:[{

      }]
    };
  }
  componentWillMount() {
    const that = this;
    // 获取所有市
    const provinceUrl = 'https://restapi.amap.com/v3/config/district?key='+gdMapConfig.key+'&keywords=&subdistrict=1&extensions=base'
    const province = ajaxCors({
      url: provinceUrl
    })
    .then((res) => {
      let provinceList = [...that.state.provinceList];
      if(res.status == 1){
        let provinceResult = res.districts[0].districts;
        for (var i in provinceResult) {
          provinceList.push(provinceResult[i].name);
        }
        that.setState({
          provinceList:provinceList
        })
      }
    })

    console.log(this.props.history.params)
    const activityPId = this.props.history.params.pid;
    const activityId = this.props.history.params.activityClassId;

    if(activityId != 'createClass'){
    // 正确获取到activityId的值，去获取他的值
      const detail = ajaxTo('api.php?entry=sys&c=logistics&a=route&do=detail',{'id':activityId})
      .then((res)=>{
        console.log(res);
        let currentData = res;

        currentData.weight_price = currentData.weight_price ? currentData.weight_price : [];
        currentData.weight_index = currentData.weight_price.length;
        currentData.light_price = currentData.light_price ? currentData.light_price : [];
        currentData.light_index = currentData.light_price.length;
        currentData.landline = currentData.landline ? currentData.landline : [{}];
        currentData.lineContact = currentData.lineContact ? currentData.lineContact : [{}];
        currentData.unit = Number(currentData.unit);

        that.setState({
          ...currentData,
          hot:res.is_hot == 1 ? true : false,
        })
      })
    }else{
      that.setState({
        unit:0,
        weight_index:that.state.weight_price.length,
        light_index:that.state.light_price.length
      })
    }

  }

  componentDidMount(){

  }
  onFormChange = (value) => {
    console.log(value);
    this.setState({value});
  };

  tabClick = (key) => {
    console.log(key);
    if(key == 0){
      history.back();
    }
  }

  onInputChange(value){
    console.log({value});
  }

  // 选择省市区三级联动
  onSelect(type, value) {
    console.log(type);
    const that = this;
    const requestUrl = 'https://restapi.amap.com/v3/config/district?key='+gdMapConfig.key+'&keywords='+value+'&subdistrict=1&extensions=base';

    const city = ajaxCors({
      url: requestUrl
    })
    .then((res) => {
      console.log(res);
      if(res.status == 1){

        let data = res.districts[0].districts;

        switch (type) {
          case 'origin_province':

            let o_cityList = [];
            for (var i in data) {
              o_cityList.push(data[i].name);
            }
            that.setState({
              o_cityList:o_cityList,
              origin_city:null,
              origin_district:null
            })

            break;

          case 'origin_city':

            let o_areaList = [];

            for (var i in data) {
              o_areaList.push(data[i].name);
            }
            that.setState({
              o_areaList:o_areaList,
              origin_district:null
            })

            break;

          case 'dest_province':

            let d_cityList = [];

            if(res.status == 1){
              for (var i in data) {
                d_cityList.push(data[i].name);
              }
              that.setState({
                d_cityList:d_cityList,
                dest_city:null,
                dest_district:null
              })
            }

            break;

          case 'dest_city':

            let d_areaList = [];

            if(res.status == 1){
              for (var i in data) {
                d_areaList.push(data[i].name);
              }
              that.setState({
                d_areaList:d_areaList,
                dest_district:null
              })
            }

            break;
          default:
            return false;
        }
      }
    })
  }

  // 提交表单信息
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {

      if (error) {
        // 处理表单报错
        return false;
      }

      let dataAry = {...that.formRef.props.value,pid:that.props.history.params.pid};

      dataAry.is_hot = dataAry.hot ? 1 : 0;

      dataAry.value = null;

      dataAry.provinceList = null;

      dataAry.o_cityList = null;

      dataAry.o_areaList = null;

      dataAry.d_cityList = null;

      dataAry.d_areaList = null;

      dataAry.status = dataAry.status ? 1 : 0;

      let apiurl = null;


      if(that.props.history.params.activityClassId != 'createClass'){
        apiurl = 'api.php?entry=sys&c=logistics&a=route&do=edit';
        dataAry = {...dataAry,id:that.props.history.params.activityClassId,person:this.props.user.admin};
      }else{
        apiurl = 'api.php?entry=sys&c=logistics&a=route&do=add';
      }

      const result = ajaxTo(apiurl,dataAry);
      result.then(function(res){
        Feedback.toast.success(res.message);
        setTimeout(()=>{
          that.props.history.router.push('/activityClassList/'+that.props.history.params.pid);
        },1500);
      })
    });
  };

  // 选择单位
  onUnitChange = (value) => {
    this.setState({
      unit:value
    })
  }

  // Dialog 操作

  // Dialog - 关闭
  onClose = (name,type) => {
    let aryList,
        editType;
    switch(type){
      case 'weight_price':
        aryList = [...this.state.weight_price]
        editType = this.state.weight_type;
        break;
      case 'light_price':
        aryList = [...this.state.light_price]
        editType = this.state.light_type;
        break;
      default:
        return false;
    }
    if(editType == 'insert'){
      aryList.pop();
    }
    this.setState({
      [name]: false,
      [type]:aryList
    });
  };

  // Dialog - 打开
  onOpen = (name,type) => {
    let aryList,
        editType,
        editName;

    let editItem = {
      yl:'',
      price:''
    };

    switch(type){
      case 'weight_price':
        aryList = [...this.state.weight_price];
        editType = 'weight_type';
        editName = 'weight_item';
        break;
      case 'light_price':
        aryList = [...this.state.light_price];
        editType = 'light_type';
        editName = 'light_item';
        break;
      default:
        return false;
    }
    let item = {
      yl:'',
      price:'',
      type:''
    }
    aryList.push(item);


    this.setState({
      [name]: true,
      [type]: aryList,
      [editType] : 'insert',
      [editName] : editItem
    });
  };

  // Dialog - 确认按钮
  onConfrim = (type,name) => {
    let editNum,
        numContent;

    switch(name){
      case 'weight_price':
        editNum = 'weight_index';
        numContent = Number(this.state.weight_index) + 1;
        break;
      case 'light_price':
        editNum = 'light_index';
        numContent = Number(this.state.light_index) + 1;
        break;
      default:
        return false;
    }
    this.setState({
      [editNum]: numContent,
      [type]: false
    })
  }

  // Dialog - 输入框改变
  onPriceChange = (type,name,index,value) => {
    console.log(index);
    let aryList,
        aryName;
    switch(type){
      case 'weight_price':
        aryList = this.state.weight_price;
        aryName = this.state.weight_type;
        break;
      case 'light_price':
        aryList = this.state.light_price;
        aryName = this.state.light_type;
        break;
      default:
        return false;
    }

    aryList[index][name] = value;
    aryList[index]['type'] = type;

    this.setState({
      [type]: aryList
    })

  }

  // 编辑价格
  editPrice = (index,type) => {
    console.log(index);
    let visible,
        editType,
        editItem,
        editContent,
        editIndexName;

    switch (type) {
      case 'weight_price':
        visible = 'weight_visible';
        editType = 'weight_type';
        editItem = 'weight_item';
        editContent = this.state.weight_price[index];
        editIndexName = 'weight_index';
        break;
      case 'light_price':
        visible = 'light_visible';
        editType = 'light_type';
        editItem = 'light_item';
        editContent = this.state.light_price[index];
        editIndexName = 'light_index';
        break;
      default:
        return false;
    }
    this.setState({
      [editItem]: editContent,
      [visible]:true,
      [editType]:'edit',
      [editIndexName]:index
    })
  }

  // 删除价格
  deletePrice = (index,type) => {
    let aryList,
        aryName,
        numContent;
    switch(type){
      case 'weight_price':
        aryList = [...this.state.weight_price];
        aryList.splice(index,1);
        aryName = 'weight_index';
        numContent = Number(this.state.weight_index) - 1;
        break;
      case 'light_price':
        aryList = [...this.state.light_price];
        aryList.splice(index,1);
        aryName = 'light_index';
        numContent = Number(this.state.light_index) - 1;
        break;
      default:
        return false;
    }
    this.setState({
      [aryName]: numContent,
      [type]: aryList
    })

  }

  // 增加联系人&座机电话
  addContact(name){
    let aryLists;
    switch(name){
      case 'landline':
        aryLists = this.state.landline;
        break;
      case 'lineContact':
        aryLists = this.state.lineContact;
        break;
      default:
        return false
    }
    aryLists.push({});
    this.setState({
      [name]:aryLists
    })
  }

  // 删除联系人&座机电话
  deleteContact(index,name){

    let aryList

    switch (name) {
      case 'landline':
        aryList = this.state.landline
        break;
      case 'lineContact':
        aryList = this.state.lineContact
        break;
      default:
        return null
    }

    aryList.splice(index,1);

    this.setState({
      [name]:aryList
    })
  }

  // 操作列展现的按钮
  rowCell = (value, index, record) => {
    return (<div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
      <Button type="primary" style={{marginRight: '15px'}} onClick={this.editPrice.bind(this,index,record.type)}>编辑</Button>
      <Button type="normal" shape="warning" onClick={this.deletePrice.bind(this,index,record.type)}>删除</Button>
    </div>);
  };


  // 改变发车频率数据
  carNumChange = (type, name,value) => {
    console.log(value,type,name)
    let item = {...this.state.car_num};
    console.log(item);
    item[name] = value;
    console.log(item);
    this.setState({
      [type]:item
    })
  }



  render() {
    const styleP={
      paddingBottom:'25px'
    }

    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <Tab onChange={this.tabChange} defaultActiveKey={1} >
          {tabs.map(item => (
            <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

            </TabPane>
          ))}
        </Tab>
        <IceFormBinderWrapper
          ref={(formRef) => {
            this.formRef = formRef;
          }}
          value={this.state}
          onChange={this.onFormChange}>
          <div>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                分部名称：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="line_company" required={true} message="公司名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="line_company"/>
              </Col>
            </Row>

            <Row>
              <Row style={{width:'100%'}}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  起始地：
                </Col>
                <Col s="22" l="22">
                  <Row>
                    <Col s="7" l="7" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="6" l="6">省：</Col>
                        <Col s="14" l="14">
                          <IceFormBinder name="origin_province" required={true} message="省必须填写">
                            <Select
                              placeholder="请选择省份"
                              onChange={this.onSelect.bind(this, "origin_province")}
                              dataSource={this.state.provinceList}
                              style={{width:'100%',textAlign: 'left'}}
                              />
                          </IceFormBinder>
                          <IceFormError name="origin_province"/>
                        </Col>
                      </Row>
                    </Col>
                    <Col s="7" l="7" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="6" l="6">市：</Col>
                        <Col s="14" l="14">
                          <IceFormBinder name="origin_city" required={true} message="市必须填写">
                            <Select
                              placeholder="请选择市"
                              onChange={this.onSelect.bind(this, "origin_city")}
                              dataSource={this.state.o_cityList}
                              style={{width:'100%',textAlign: 'left'}}
                              />
                          </IceFormBinder>
                          <IceFormError name="origin_city"/>
                        </Col>
                      </Row>
                    </Col>
                    <Col s="7" l="7" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="6" l="6">区：</Col>
                        <Col s="14" l="14">
                          <IceFormBinder name="origin_district" required={false}>
                            <Select
                              placeholder="请选择区"
                              onChange={this.onSelect.bind(this, "origin_district")}
                              dataSource={this.state.o_areaList}
                              style={{width:'100%',textAlign: 'left'}}
                              />
                          </IceFormBinder>
                          <IceFormError name="origin_district"/>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>

            <Row>
              <Row style={{width:'100%'}}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  目的地：
                </Col>
                <Col s="22" l="22">
                  <Row>
                    <Col s="7" l="7" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="6" l="6">省：</Col>
                        <Col s="14" l="14">
                          <IceFormBinder name="dest_province" required={true} message="省必须填写">
                            <Select
                              placeholder="请选择省份"
                              onChange={this.onSelect.bind(this, "dest_province")}
                              dataSource={this.state.provinceList}
                              style={{width:'100%',textAlign: 'left'}}
                              />
                          </IceFormBinder>
                          <IceFormError name="dest_province"/>
                        </Col>
                      </Row>
                    </Col>
                    <Col s="7" l="7" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="6" l="6">市：</Col>
                        <Col s="14" l="14">
                          <IceFormBinder name="dest_city" required={true} message="市必须填写">
                            <Select
                              placeholder="请选择市"
                              onChange={this.onSelect.bind(this, "dest_city")}
                              dataSource={this.state.d_cityList}
                              style={{width:'100%',textAlign: 'left'}}
                              />
                          </IceFormBinder>
                          <IceFormError name="dest_city"/>
                        </Col>
                      </Row>
                    </Col>
                    <Col s="7" l="7" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="6" l="6">区：</Col>
                        <Col s="14" l="14">
                          <IceFormBinder name="dest_district" required={false}>
                            <Select
                              placeholder="请选择区"
                              onChange={this.onSelect.bind(this, "dest_district")}
                              dataSource={this.state.d_areaList}
                              style={{width:'100%',textAlign: 'left'}}
                              />
                          </IceFormBinder>
                          <IceFormError name="dest_district"/>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                辐射区域：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="line_layer" required={false}>
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="line_layer"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                分部公司地址：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="line_address" required={false}>
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="line_address"/>
              </Col>
            </Row>

            {
              this.state.landline ?

                this.state.landline.length >= 0 ?

                  this.state.landline.map((v,i) => (
                    <Row style={styles.formItem}>
                      <Col s="12" l="12" style={styles.formLabel}>
                        <Row style={styles.formItem}>
                          <Col s="4" l="8">座机号码：</Col>
                          <Col s="4" l="4">
                            <IceFormBinder name={`landline[${i}].label`} required={false}>
                              <Input
                                style={{
                                  width: '100%',
                                  marginRight: '10px'
                                }}
                                placeholder="别名"/>
                            </IceFormBinder>
                            <IceFormError name={`landline[${i}].label`} />
                          </Col>
                          <Col s="8" l="8">
                            <IceFormBinder name={`landline[${i}].number`} required={false}>
                              <Input
                                style={{
                                  width: '100%'
                                }}
                                placeholder="请输入座机号码"/>
                            </IceFormBinder>
                            <IceFormError name={`landline[${i}].number`} />
                          </Col>
                        </Row>
                      </Col>

                      {
                        i != 0 ?
                        <Col s="2" l="2">
                          <Button type="normal" shape="warning" onClick={this.deleteContact.bind(this,i,'landline')}>删除</Button>
                        </Col>

                        :null
                      }
                    </Row>
                  ))

                  : null

                : null

            }


            {/* 添加按钮 */}
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>

              </Col>

              <Col s="12" l="10">
                <Button type="primary" onClick={()=>this.addContact('landline')}>添加座机号码</Button>
              </Col>
            </Row>


            {
              this.state.lineContact ?

                this.state.lineContact.length >= 0 ?

                  this.state.lineContact.map((v,i) => (

                    <Row style={styles.formItem}>
                      <Col s="12" l="12" style={styles.formLabel}>
                        <Row style={styles.formItem}>
                          <Col s="4" l="8">联系人：</Col>
                          <Col s="12" l="12">
                            <IceFormBinder name={`lineContact[${i}].name`} required={false}>
                              <Input
                                style={{
                                  width: '100%'
                                }}
                                placeholder="请输入联系人"/>
                            </IceFormBinder>
                            <IceFormError name={`lineContact[${i}].name`} />
                          </Col>
                        </Row>
                      </Col>
                      <Col s="10" l="10" style={styles.formLabel}>
                        <Row style={styles.formItem}>
                          <Col s="5" l="10">手机号码：</Col>
                            <Col s="4" l="4">
                              <IceFormBinder name={`lineContact[${i}].label`} required={false}>
                                <Input
                                  style={{
                                    width: '100%'
                                  }}
                                  placeholder="别名"/>
                              </IceFormBinder>
                              <IceFormError name={`lineContact[${i}].label`} />
                            </Col>
                          <Col s="8" l="8">
                            <IceFormBinder name={`lineContact[${i}].phone`} required={false}>
                              <Input
                                style={{
                                  width: '100%'
                                }}
                                placeholder="请输入手机号码"/>
                            </IceFormBinder>
                            <IceFormError name={`lineContact[${i}].phone`} />
                          </Col>
                        </Row>
                      </Col>

                      {
                        i != 0 ?

                          <Col s="2" l="2">
                            <Button type="normal" shape="warning" onClick={this.deleteContact.bind(this,i,'lineContact')}>
                              删除
                            </Button>
                          </Col>

                         :null
                      }
                    </Row>
                  ))

                  : null

                : null

            }

            {/* 添加按钮 */}
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>

              </Col>

              <Col s="12" l="10">
                <Button type="primary" onClick={()=>this.addContact('lineContact')}>添加联系人</Button>
              </Col>
            </Row>

            {/*填写信息项*/}
            <Dialog
              visible={this.state.weight_visible}
              onOk={this.onConfrim.bind(this,'weight_visible','weight_price')}
              onCancel={this.onClose.bind(this,'weight_visible','weight_price')}
              onClose={this.onClose.bind(this,'weight_visible','weight_price')}
              title="请填写重货价-价格区间"
              footerAlign="center"
            >
              <div style={styles.divPadding}>
                <Input
                  addonBefore="运量"
                  addonAfter={`${this.state.unitAry[this.state.unit]}以上`}
                  size="large"
                  placeholder="请输入运量"
                  style={{width:'100%',marginBottom: '15px'}}
                  onChange={this.onPriceChange.bind(this,'weight_price','yl',this.state.weight_index)}
                  defaultValue={this.state.weight_item.yl}
                />
                <Input
                  addonBefore="网上报价"
                  addonAfter={`元/${this.state.unitAry[this.state.unit]}`}
                  size="large"
                  placeholder="请输入网上报价"
                  style={{width:'100%'}}
                  onChange={this.onPriceChange.bind(this,'weight_price','price',this.state.weight_index)}
                  defaultValue={this.state.weight_item.price}
                />
              </div>
            </Dialog>

            <Row style={styles.formBottom}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                重货价（{this.state.unitAry[this.state.unit]}）：
              </Col>
              <Col s="12" l="10">
                <div style={styles.btnGroup}>

                  <Select
                    value={this.state.unit}
                    onChange={this.onUnitChange.bind(this)}
                    style={{marginRight: '15px'}}
                  >
                    <Option value="0">公斤</Option>
                    <Option value="1">斤</Option>
                  </Select>

                  <Button type="primary" onClick={this.onOpen.bind(this,'weight_visible','weight_price')}>增加价格区间</Button>
                </div>
                <Table dataSource={this.state.weight_price}>
                  <Table.Column title={`运量(${this.state.unitAry[this.state.unit]}以上)`} dataIndex="yl" />
                  <Table.Column title={`网上报价(元/${this.state.unitAry[this.state.unit]})`} dataIndex="price" />
                  <Table.Column title="操作" cell={this.rowCell} width="40%" />
                </Table>
              </Col>
            </Row>

            {/*填写信息项*/}
            <Dialog
              visible={this.state.light_visible}
              onOk={this.onConfrim.bind(this,'light_visible','light_price')}
              onCancel={this.onClose.bind(this,'light_visible','light_price')}
              onClose={this.onClose.bind(this,'light_visible','light_price')}
              title="请填写重货价-价格区间"
              footerAlign="center"
            >
              <div style={styles.divPadding}>
                <Input
                  addonBefore="运量"
                  addonAfter="立方以上"
                  size="large"
                  placeholder="请输入运量"
                  style={{width:'100%',marginBottom: '15px'}}
                  onChange={this.onPriceChange.bind(this,'light_price','yl',this.state.light_index)}
                  defaultValue={this.state.light_item.yl}
                />
                <Input
                  addonBefore="网上报价"
                  addonAfter="元/立方"
                  size="large"
                  placeholder="请输入网上报价"
                  style={{width:'100%'}}
                  onChange={this.onPriceChange.bind(this,'light_price','price',this.state.light_index)}
                  defaultValue={this.state.light_item.price}
                />
              </div>
            </Dialog>

            <Row style={styles.formBottom}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                轻货价：
              </Col>
              <Col s="12" l="10">
                <div style={styles.btnGroup}>
                  <Button type="primary" onClick={this.onOpen.bind(this,'light_visible','light_price')}>增加价格区间</Button>
                </div>
                <Table dataSource={this.state.light_price}>
                  <Table.Column title="运量(立方以上)" dataIndex="yl" />
                  <Table.Column title="网上报价(元/立方)" dataIndex="price" />
                  <Table.Column title="操作" cell={this.rowCell} width="40%" />
                </Table>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                最低一票价格：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="low_price" required={false}>
                  <Input style={{
                      width: '100%'
                    }}
                    addonAfter="元"/>
                </IceFormBinder>
                <IceFormError name="low_price"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                运输时效：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="tran_time" required={false}>
                  <Input style={{
                      width: '100%'
                    }}
                    addonAfter="小时"/>
                </IceFormBinder>
                <IceFormError name="tran_time"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                发车频率：
              </Col>

              <Col s="12" l="10">
                <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                  <Input style={{
                      width: '40%',
                      marginRight: '15px'
                    }}
                    addonAfter="天"
                    value={this.state.car_num.day}
                    onChange={this.carNumChange.bind(this,'car_num','day')}
                  />
                  <Input style={{
                      width: '40%'
                    }}
                    addonAfter="次"
                    value={this.state.car_num.num}
                    onChange={this.carNumChange.bind(this,'car_num','num')}
                  />
                </div>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                是否是热门路线：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="hot">
                  <SwitchForForm defaultValue={this.state.hot}/>
                </IceFormBinder>
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


            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="4" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.activityClassId!='createClass'?'保存':'立即创建'}
                </Button>
                <Button style={styles.resetBtn} onClick={this.reset}>
                  重置
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
  formBottom:{
    marginBottom: '25px'
  },
  resetBtn: {
    marginLeft: '20px'
  },
  btnGroup:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    marginBottom:'20px'
  },
  divPadding:{
    boxSizing:'border-box',
    padding:'15px 10px'
  }
};
