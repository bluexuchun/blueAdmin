import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { asideNavs } from '../../../../navs'
import axios from 'axios';
import uploadUrl,{ajaxTo,ajaxCors} from '../../../../util/util';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Tab,
  Feedback
} from '@icedesign/base';

const tabs = [
  { tab: "返回", key: 0, content: "" },
  { tab: "用户信息管理", key: 1, content: "" },
];
const TabPane = Tab.TabPane;

const { Row, Col } = Grid;

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props} checked={checked} onChange={(currentChecked) => {
      if (props.onChange)
        props.onChange(currentChecked);
      }}/>);
};


export default class CreateActivityForm extends Component {
  static displayName = 'CreateActivityForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      roleList:[]
    };
  }

  componentWillMount() {
    const that = this;

    // 获取用户信息
    const id = this.props.history.params.id;
    const userInfo = ajaxTo('api.php?entry=sys&c=admin&a=edit',{id:id})
    .then((res) => {
      console.log(res);
      res.role_id = res.role.id;
      res.status = res.status == 1 ? true : false
      that.setState({
        ...res,
        id:id
      })
    })

    // 获取所有角色列表
    const roleLists = ajaxTo('api.php?entry=sys&c=role&a=list',{})
    .then((res) => {
      if(res.status == 1){
        let roleList = [...that.state.roleList];
        res.data.map((v,i) => {
          let item = {
            label:v.name,
            value:v.id
          }
          roleList.push(item);
        })
        that.setState({
          roleList:roleList
        })
      }
    })
  }

  componentDidMount() {

  }

  onFormChange = (value) => {
    this.setState({
      value,
    });
  };

  reset = () => {
    this.setState({

    });
  };

  submit = () => {
    const that = this;
    this.formRef.validateAll((error, value) => {
      console.log('error', error, 'value', value);
      if (error) {
        // 处理表单报错
        return false;
      }
      // 提交当前填写的数据
      delete value.roleList;
      delete value.role;
      delete value.value;
      value.status = value.status ? 1 : 0;

      const result = ajaxTo('api.php?entry=sys&c=admin&a=edit&do=update',{
        id:that.state.id,
        name:that.state.name,
        ...value
      })
      .then((res) => {
        console.log(res);
        if(res.status == 1){
          Feedback.toast.success('更新成功');
          this.props.history.router.push('/userAuthority');
        }
      })
    });
  };

  handleClick = (key) => {
    if(key == 0){
      history.back();
    }
  }

  render() {
    console.log(this.state);
    return (
      <div className="create-activity-form">
        <IceContainer style={styles.container}>
          <Tab defaultActiveKey={1}>
            {tabs.map(item => (
              <TabPane key={item.key} tab={item.tab} onClick={this.handleClick}>

              </TabPane>
            ))}
          </Tab>
          <IceFormBinderWrapper
            ref={(formRef) => {
              this.formRef = formRef;
            }}
            value={this.state}
            onChange={this.onFormChange}
          >
            <div>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                  用户名：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder
                    name="name"
                  >
                    <Input style={{ width: '100%' }} disabled="true" value={this.state.name}/>
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                  密码：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder
                    name="password"
                  >
                    <Input htmlType="password" maxLength="20" style={{ width: '100%' }}/>
                  </IceFormBinder>
                  <IceFormError name="password" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                  权限角色：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="role_id">
                    <Select
                      className="next-form-text-align"
                      dataSource={this.state.roleList}
                    />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row>
                <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                  状态：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="status">
                    <SwitchForForm defaultValue={this.state.status}/>
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.btns}>
                <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                  {' '}
                </Col>
                <Col s="12" l="10">
                  <Button type="primary" onClick={this.submit}>
                    保存
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
    paddingBottom: 0,
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px',
  },
  formLabel: {
    textAlign: 'right',
  },
  btns: {
    margin: '25px 0',
  },
  resetBtn: {
    marginLeft: '20px',
  },
};
