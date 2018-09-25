/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import axios from 'axios';
import uploadUrl,{ajaxTo,ajaxCors} from '../../../../util/util';
import {
  Input,
  Button,
  Radio,
  Switch,
  Upload,
  Grid,
  Tree,
  Tab,
  Feedback
} from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import { asideNavs } from '../../../../navs'

const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;
const { Node: TreeNode } = Tree;
const TabPane = Tab.TabPane;

const tabs = [
  { tab: "角色权限列表", key: "0"},
  { tab: "角色权限编辑", key: "1"},
];


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

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      requestApi:'api.php?entry=sys&c=role&a=edit&do=add'
    };
  }

  componentWillMount() {
    // 获取角色id
    const that = this;
    let roleId = this.props.history.params.id;
    if(roleId != 'create'){
      let roleInfo = ajaxTo('api.php?entry=sys&c=role&a=edit',{
        id:roleId
      })
      .then((res) => {
        let data = res.data;
        let requestApi = 'api.php?entry=sys&c=role&a=edit&do=update';
        that.setState({
          ...data.detail,
          node:data.node,
          requestApi:requestApi
        })
        console.log(this.state);
      })
    }else{
      let requestApi = 'api.php?entry=sys&c=role&a=edit&do=add';
      this.setState({
        requestApi:requestApi,
        status:false
      })
    }
  }

  componentDidMount() {

  }

  formChange = (value) => {
    this.setState({
      value
    });
  }

  onCheck(keys, info){
    let roles = [];

    let keyList = [];

    let roleList = info.checkedNodes;

    // 重新整理数组
    roleList.map((v,i) => {
      let parentName = v.props.name;
      let name = v.props.parentName;
      if(parentName != undefined){
        let item = {
          mname:parentName
        }
        roles.push(item);
      }else if(name != undefined){
        let item = {
          mname:name,
          aname:v.key
        }
        roles.push(item)
      }
    })
    this.setState({
      node:roles
    })
  }

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      console.log('errors', errors, 'values', values);
      if (errors) {
        // 处理表单报错
        return false;
      }
      let data = {...this.state};
      delete data.value;
      data.status = data.status ? 1 : 0;
      const roleResult = ajaxTo(this.state.requestApi,{
        ...data
      })
      .then((res) => {
        if(res.status == 1){
          Feedback.toast.success('保存成功');
          this.props.history.router.push('/roleListPage');
        }
      })
    });
  };

  // 点击tab的函数
  tabClick = (key) => {
    if(key == 0){
      this.props.history.router.push('/roleListPage');
    }
  }


  render() {
    let newNode = [];
    let nodeList = this.state.node;
    if(nodeList){
      nodeList.map((v,i) => {
        newNode.push(v.aname);
      })
    }
    console.log(asideNavs);
    return (
      <div className="settings-form">
        <IceContainer>
          <Tab defaultActiveKey={1}>
            {tabs.map(item => (
              <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

              </TabPane>
            ))}
          </Tab>
          <IceFormBinderWrapper
            value={this.state}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  角色名：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required max={10} message="必填">
                    <Input size="large" placeholder="请填写角色名" />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  权限设置：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="role" max={10}>
                    <Tree
                      multiple
                      checkable
                      checkedKeys={newNode}
                      enableCheckedCache={false}
                      onCheck={this.onCheck.bind(this)}
                    >
                      <TreeNode label="权限管理" key="all">
                        {
                          asideNavs ?
                          asideNavs.map((v,i) => (
                            <TreeNode parentName={v.name} label={v.text} key={v.name}>

                              { v.children ?
                                v.children.map((cv,ci) => (
                                  <TreeNode parentName={v.name} label={cv.text} key={cv.name} />
                                ))
                                :
                                null
                              }

                            </TreeNode>
                          ))
                          :
                          null
                        }
                      </TreeNode>
                    </Tree>
                  </IceFormBinder>
                  <IceFormError name="role" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  备注：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="remark" required max={10} message="必填">
                    <Input size="large" placeholder="请填写备注" />
                  </IceFormBinder>
                  <IceFormError name="remark" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  状态：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="status">
                    <Switch value={this.state.status}/>
                  </IceFormBinder>
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
