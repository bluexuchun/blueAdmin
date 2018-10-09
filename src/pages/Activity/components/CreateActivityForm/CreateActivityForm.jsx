import React, { Component } from 'react';
import axios from 'axios';
import { ajaxTo, ajaxCors, baseUrl, uploadUrl } from '../../../../util/util';
import gdMapConfig from '../../../../util/config';
import IceContainer from '@icedesign/container';
import { Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
// 引入map组件
import Map from '../../../../components/Map';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError } from '@icedesign/form-binder';
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
} from '@icedesign/base';
import { connect } from 'react-redux';

const { Row, Col } = Grid;
const { Core } = Upload;
const { DragUpload } = Upload;
const { ImageUpload } = Upload;
const { Combobox } = Select;
const TabPane = Tab.TabPane;


const tabs = [
  { tab: '公司列表', key: 0, content: '/activityList' },
  { tab: '公司编辑', key: 1, content: '/activity/create' },
];


const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;


const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props}
    checked={checked}
    onChange={(currentChecked) => {
      if (props.onChange) { props.onChange(currentChecked); }
      }}
  />);
};

@connect(
  state => ({ user: state.user })
)

export default class CreateActivityForm extends Component {
  static displayName = 'CreateActivityForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      hotline: false,
      recommend: false,
      introduce: null,
      mapDataSource: {
        dataSource: [

        ],
        value: '',
        location: {

        },
      },
      contactLists: [{

      }],
      phonelits: [{

      }],
    };
  }

  componentWillMount() {
    const activityId = this.props.history.params.activityId;
    // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('api.php?entry=sys&c=logistics&a=company&do=detail', { id: activityId })
        .then((res) => {
          console.log(res);
          const currentData = { ...res };

          // 给地图初始信息
          if (res.address && res.latitude && res.longitude) {
            const mapDataSource = { ...this.state.mapDataSource };
            mapDataSource.location = {
              type: 'change',
              name: '',
              longitude: res.longitude,
              latitude: res.latitude,
            };
            this.setState({
              mapDataSource,
            });
          }

          console.log(this.state.mapDataSource);

          currentData.contactLists = res.contactLists ? res.contactLists : [{}];

          currentData.bg_picture = res.bg_picture ? this.changeImg(res.bg_picture) : [];
          currentData.cd_picture = res.cd_picture ? this.changeImg(res.cd_picture) : [];
          currentData.mt_picture = res.mt_picture ? this.changeImg(res.mt_picture) : [];
          currentData.other_picture = res.other_picture ? this.changeImg(res.other_picture) : [];

          currentData.phonelits = res.phonelits ? res.phonelits : [{}];


          currentData.status = res.status == 1;
          currentData.is_recommend = res.is_recommend == 1;
          currentData.hotline = res.hotline == 1;
          currentData.contact = !res.contact ? [{}] : res.contact;


          this.setState({
            ...currentData,
            introduce: res.introduce,
          });
        });
    } else {
      const mapDataSource = { ...this.state.mapDataSource };
      mapDataSource.location = {
        type: 'init',
        name: '',
        longitude: 0,
        latitude: 0,
      };
      this.setState({
        propties: 1,
        mapDataSource,
      });

      setTimeout(() => {
        // 防止输入表格无限初始化地图
        mapDataSource.location.type = 'normal';
        this.setState({
          mapDataSource,
        });
      }, 2000);
    }
  }

  componentDidMount() {

  }

  // 处理加载的图片地址
  changeImg = (aryLists) => {
    // 图片格式

    const lists = [];
    let item;
    if (aryLists[0] != '') {
      aryLists.map((v, i) => {
        if (!v.name) {
          item = {
            name: 'pic.png',
            fileName: 'pic.png',
            status: 'done',
            downloadURL: v,
            fileURL: v,
            imgURL: v,
          };
        } else {
          item = v;
        }


        lists.push(item);
      });
    }
    return lists;
  }

  // 上传LOGO成功的回调函数
  onSuccessUpload = (type, res, file) => {
    Feedback.toast.success('上传成功');
    this.setState({
      [type]: baseUrl + res.imgURL,
    });
  }

  // 上传统一图片成功回调地址
  onSuccessAll = (type, res, file) => {
    console.log(res);
    Feedback.toast.success('上传成功');
    this.setState({
      [type]: baseUrl + res.imgURL,
    });
  }


  // 上传banner成功的回调函数
  onSuccessMultiple = (res, file, type) => {
    Feedback.toast.success('上传成功');

    let aryLists;

    const imgInfo = {
      name: 'IMG.png',
      status: 'done',
      downloadURL: baseUrl + res.imgURL,
      fileURL: baseUrl + res.imgURL,
      imgURL: baseUrl + res.imgURL,
    };

    switch (type) {
      case 'bannerList':
        if (!this.state.bannerList) {
          aryLists = [];
        } else {
          aryLists = [...this.state.bannerList];
        }
        break;
      case 'mt_picture':
        if (!this.state.mt_picture) {
          aryLists = [];
        } else {
          aryLists = [...this.state.mt_picture];
        }
        break;
      case 'bg_picture':
        if (!this.state.bg_picture) {
          aryLists = [];
        } else {
          aryLists = [...this.state.bg_picture];
        }
        break;
      case 'cd_picture':
        if (!this.state.cd_picture) {
          aryLists = [];
        } else {
          aryLists = [...this.state.cd_picture];
        }
        break;
      case 'other_picture':
        if (!this.state.other_picture) {
          aryLists = [];
        } else {
          aryLists = [...this.state.other_picture];
        }
        break;
      default:
        return false;
    }

    aryLists.push(imgInfo);

    this.setState({
      [type]: aryLists,
    });
  }

  // 移除多个图片的方法
  onRemoveMultiple = (res, file, type) => {
    console.log(res, file, type);

    const newImg = [];

    const uid = res.uid;

    if (file.length > 0) {
      file.map((v, i) => {
        const imgInfo = {
          name: 'IMG.png',
          status: 'done',
          downloadURL: baseUrl + v.imgURL,
          fileURL: baseUrl + v.imgURL,
          imgURL: baseUrl + v.imgURL,
        };
        newImg.push(imgInfo);
      });
    }

    this.setState({
      [type]: newImg,
    });
  }

  // 改变表单的函数
  onFormChange = (value) => {
    this.setState({ value });

    const mapDataSource = { ...this.state.mapDataSource };
    // 防止输入表格无限初始化地图
    mapDataSource.location.type = 'normal';
    this.setState({
      mapDataSource,
    });
  };

  // 表单提交
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {
        Feedback.toast.error('请填写完整信息');
        return false;
      }

      const allValue = { ...this.state };

      allValue.status = allValue.status ? 1 : 0;
      allValue.is_recommend = allValue.is_recommend ? 1 : 0;
      allValue.hotline = allValue.hotline ? 1 : 0;

      delete allValue.value;
      delete allValue.mapDataSource;

      let apiurl = null;
      let dataAry = { ...allValue, introduce: that.state.introduce };

      if (this.props.history.params.activityId != 'create') {
        apiurl = 'api.php?entry=sys&c=logistics&a=company&do=edit';
        dataAry = { ...dataAry, id: this.props.history.params.activityId, person: this.props.user.admin };
      } else {
        apiurl = 'api.php?entry=sys&c=logistics&a=company&do=add';
      }

      const result = ajaxTo(apiurl, dataAry);
      result.then((res) => {
        if (res.status == 1) {
          Feedback.toast.success(res.message);
          setTimeout(() => {
            that.props.history.router.push('/activityList');
          }, 1500);
        } else {
          Feedback.toast.error(res.message);
          return false;
        }
      });
    });
  };

  // 点击tab的函数
  tabClick = (key) => {
    const url = tabs[key].content;
    this.props.history.router.push(url);
  }


  // 富文本上传音频
  uploadMedia = (param) => {
    console.log(param);
    const serverURL = uploadUrl;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容

    const successFn = (response) => {
      console.log(response);
      const result = eval(`(${xhr.responseText})`);
      const imgUrl = baseUrl + result.imgURL;
      param.success({
        url: imgUrl,
      });
    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100);
    };

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('filename', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  }


  // 富文本文字变化
  richTextOnchange = (value) => {
    this.setState({
      introduce: value,
    });
  }

  // 增加联系人
  addContact(name) {
    let aryLists;
    switch (name) {
      case 'phonelits':
        aryLists = this.state.phonelits;
        break;
      case 'contactLists':
        aryLists = this.state.contactLists;
        break;
      default:
        return false;
    }
    aryLists.push({});
    this.setState({
      [name]: aryLists,
    });
  }

  // 删除联系人
  deleteContact(index, name) {
    let aryLists;
    switch (name) {
      case 'phonelits':
        aryLists = this.state.phonelits;
        break;
      case 'contactLists':
        aryLists = this.state.contactLists;
        break;
      default:
        return false;
    }
    aryLists.splice(index, 1);
    this.setState({
      [name]: aryLists,
    });
  }

  // 搜索地址的结果
  onAddressSearch(value) {
    const that = this;
    const mapDataSource = { ...this.state.mapDataSource };
    const data = { ...this.state };
    const searchUrl = `https://restapi.amap.com/v3/geocode/geo?address=${value.key}&output=JSON&key=${gdMapConfig.key}`;
    const result = ajaxCors({ url: searchUrl })
      .then((res) => {
        if (res.status == 1) {
        // 先做一个结果的
          const data = res.geocodes[0];
          const location = data.location.split(',');
          mapDataSource.location = {
            type: 'change',
            name: value.key,
            longitude: location[0],
            latitude: location[1],
          };
          mapDataSource.value = value.key;


          that.setState({
            longitude: location[0],
            latitude: location[1],
            address: value.key,
            mapDataSource,
          });
        }
      });
  }

  // 搜索变化 自动根据输入的地址去搜索相关信息
  onAddressChange(value) {
    const isEnglish = /^[a-zA-Z]*$/.test(value);
    if (!isEnglish) {
      const that = this;
      setTimeout(() => {
        const url = `https://restapi.amap.com/v3/assistant/inputtips?key=${gdMapConfig.key}&keywords=${value}&type=&location=&city=&datatype=all`;
        const mapSource = { ...this.state.mapDataSource };
        mapSource.dataSource = [];
        const result = ajaxCors({ url })
          .then((res) => {
            if (res.status == 1) {
              const data = res.tips;
              if (data.length > 0) {
                for (const i in data) {
                  const dataInfo = {
                    label: data[i].district + data[i].name,
                    value: data[i].district + data[i].name,
                  };
                  mapSource.dataSource.push(dataInfo);
                }
              } else {
                const dataInfo = {
                  label: '没搜索到相关信息...',
                };
                mapSource.dataSource.push(dataInfo);
              }
              that.setState({
                mapDataSource: mapSource,
              });
            }
          });
      }, 500);
    }
  }


  // 地图组件改变完成 无需在做变化
  onMapNormal() {
    const mapDataSource = { ...this.state.mapDataSource };
    mapDataSource.location.type = 'normal';
    this.setState({
      mapDataSource,
    });
  }

  // 企业性质选择
  proptiesChange = (value) => {
    console.log(value);
    this.setState({
      propties: value,
    });
  }


  render() {
    // 富文本的配置
    const editorProps = {
      height: 400,
      contentFormat: 'html',
      placeholder: '公司详情...',
      onChange: this.richTextOnchange,
      onRawChange: this.handleRawChange,
      initialContent: this.state.introduce,
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
        validateFn: null, // 指定本地校验函数，说明见下文
        uploadFn: this.uploadMedia, // 指定上传函数，说明见下文
        removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
        onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
      },
    };


    // Combobox的配置
    const comboboxConfig = {
      size: 'large',
      mutiple: false,
      hasArrow: true,
      disabled: false,
    };

    // 企业性质
    const propties = [
      { label: '专线', value: 1 },
      { label: '仓库', value: 2 },
      { label: '冷链', value: 3 },
      { label: '危化', value: 4 },
      { label: '网点', value: 5 },
    ];


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
                  <TabPane key={item.key} tab={item.tab} onClick={this.tabClick} />
                ))}
              </Tab>
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司名称：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="name" required={false} message="公司名称必须填写">
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入公司名称"
                    />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  企业性质：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="propties">
                    <Select
                      style={{ width: '100%' }}
                      className="next-form-text-align"
                      dataSource={propties}
                      defaultValue={this.state.propties}
                      onChange={this.proptiesChange.bind(this)}
                    />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  所属人：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="personal" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入公司所属人"
                    />
                  </IceFormBinder>
                  <IceFormError name="personal" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  档案编号：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="fileNumber" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入档案编号"
                    />
                  </IceFormBinder>
                  <IceFormError name="fileNumber" />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  LOGO：
                </Col>
                <Col s="12" l="10">
                  <Upload
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        width: '320px',
                        height: '180px',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '12px',
                      }}
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res, file) => this.onSuccessAll('logo_path', res, file)}
                  >
                    {this.state.logo_path ?
                      <Img
                        width={320}
                        height={180}
                        src={this.state.logo_path}
                        type="cover"
                        style={{
                            borderRadius: '5px',
                          }}
                      />
                        :
                      <div style={{ width: '320px', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: '1px dashed #aaa', borderRadius: '5px' }}>
                        <div style={{ color: '#3080FE', fontSize: '30px', width: '100%', textAlign: 'center' }}>+</div>
                        <div style={{ color: '#3080FE', fontSize: '14px', width: '100%', textAlign: 'center' }}>上传图片</div>
                      </div>
                      }
                  </Upload>
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  营业执照：
                </Col>
                <Col s="12" l="10">
                  <Upload
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        width: '320px',
                        height: '180px',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '12px',
                      }}
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res, file) => this.onSuccessAll('license_path', res, file)}
                  >
                    {this.state.license_path ?
                      <Img
                        width={320}
                        height={180}
                        src={this.state.license_path}
                        type="cover"
                        style={{
                            borderRadius: '5px',
                          }}
                      />
                        :
                      <div style={{ width: '320px', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: '1px dashed #aaa', borderRadius: '5px' }}>
                        <div style={{ color: '#3080FE', fontSize: '30px', width: '100%', textAlign: 'center' }}>+</div>
                        <div style={{ color: '#3080FE', fontSize: '14px', width: '100%', textAlign: 'center' }}>上传图片</div>
                      </div>
                      }
                  </Upload>
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司门头照片：
                </Col>
                <Col s="12" l="18">
                  <ImageUpload
                    listType="picture-card"
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    locale={{
                      image: {
                        cancel: '取消上传',
                        addPhoto: '上传图片',
                      },
                    }}
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res, file) => this.onSuccessMultiple(res, file, 'mt_picture')}
                    onRemove={(res, file) => this.onRemoveMultiple(res, file, 'mt_picture')}
                    onError={this.onError}
                    fileList={this.state.mt_picture}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司办公照片：
                </Col>
                <Col s="12" l="18">
                  <ImageUpload
                    listType="picture-card"
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    locale={{
                      image: {
                        cancel: '取消上传',
                        addPhoto: '上传图片',
                      },
                    }}
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res, file) => this.onSuccessMultiple(res, file, 'bg_picture')}
                    onRemove={(res, file) => this.onRemoveMultiple(res, file, 'bg_picture')}
                    onError={this.onError}
                    fileList={this.state.bg_picture}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司场地照片：
                </Col>
                <Col s="12" l="18">
                  <ImageUpload
                    listType="picture-card"
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    locale={{
                      image: {
                        cancel: '取消上传',
                        addPhoto: '上传图片',
                      },
                    }}
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res, file) => this.onSuccessMultiple(res, file, 'cd_picture')}
                    onRemove={(res, file) => this.onRemoveMultiple(res, file, 'cd_picture')}
                    onError={this.onError}
                    fileList={this.state.cd_picture}
                  />
                </Col>
              </Row>

              <Row style={styles.imgPadding}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  其他照片：
                </Col>
                <Col s="12" l="18">
                  <ImageUpload
                    listType="picture-card"
                    action={uploadUrl}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    locale={{
                      image: {
                        cancel: '取消上传',
                        addPhoto: '上传图片',
                      },
                    }}
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={(res, file) => this.onSuccessMultiple(res, file, 'other_picture')}
                    onRemove={(res, file) => this.onRemoveMultiple(res, file, 'other_picture')}
                    onError={this.onError}
                    fileList={this.state.other_picture}
                  />
                </Col>
              </Row>

              {/* 联系人 */}

              {
                this.state.contactLists.length > 0 ?
                this.state.contactLists.map((item, index) => (
                  <Row style={styles.formItem}>
                    <Col s="12" l="12" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="4" l="8">联系人：</Col>
                        <Col s="12" l="12">
                          <IceFormBinder name={`contactLists[${index}].linkman`} required={false}>
                            <Input
                              style={{
                                width: '100%',
                              }}
                              placeholder="请输入联系人"
                            />
                          </IceFormBinder>
                          <IceFormError name={`contactLists[${index}].linkman`} />
                        </Col>
                      </Row>
                    </Col>
                    <Col s="10" l="10" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="5" l="10">联系方式：</Col>
                        <Col s="4" l="4">
                          <IceFormBinder name={`contactLists[${index}].label`} required={false}>
                            <Input
                              style={{
                                width: '100%',
                              }}
                              placeholder="别名"
                            />
                          </IceFormBinder>
                          <IceFormError name={`contactLists[${index}].label`} />
                        </Col>
                        <Col s="8" l="8">
                          <IceFormBinder name={`contactLists[${index}].phone`} required={false}>
                            <Input
                              style={{
                                width: '100%',
                              }}
                              placeholder="请输入联系方式"
                            />
                          </IceFormBinder>
                          <IceFormError name={`contactLists[${index}].phone`} />
                        </Col>
                      </Row>
                    </Col>
                    {
                      index != 0 ? (<Col s="2" l="2">
                        <Button onClick={() => this.deleteContact(index, 'contactLists')}>删除</Button>
                                    </Col>)
                      :
                      null
                    }
                  </Row>
                ))
              : null}

              {/* 添加按钮 */}
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel} />

                <Col s="12" l="10">
                  <Button type="primary" onClick={() => this.addContact('contactLists')}>添加联系人</Button>
                </Col>
              </Row>

              {/* 公司信息 */}
              {
                this.state.phonelits.length > 0 ?
                this.state.phonelits.map((item, index) => (
                  <Row style={styles.formItem}>
                    <Col s="12" l="12" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="4" l="8">公司电话：</Col>
                        <Col s="4" l="4">
                          <IceFormBinder name={`phonelits[${index}].label`} required={false}>
                            <Input
                              style={{
                                width: '100%',
                              }}
                              placeholder="别名"
                            />
                          </IceFormBinder>
                          <IceFormError name={`phonelits[${index}].label`} />
                        </Col>
                        <Col s="8" l="8">
                          <IceFormBinder name={`phonelits[${index}].phone`} required={false}>
                            <Input
                              style={{
                                width: '100%',
                              }}
                              placeholder="请输入公司电话"
                            />
                          </IceFormBinder>
                          <IceFormError name={`phonelits[${index}].phone`} />
                        </Col>
                      </Row>
                    </Col>
                    <Col s="10" l="10" style={styles.formLabel}>
                      <Row style={styles.formItem}>
                        <Col s="5" l="10">公司地址：</Col>
                        <Col s="12" l="12">
                          <IceFormBinder name={`phonelits[${index}].address`} required={false}>
                            <Input
                              style={{
                                width: '100%',
                              }}
                              placeholder="请输入公司地址"
                            />
                          </IceFormBinder>
                          <IceFormError name={`phonelits[${index}].address`} />
                        </Col>
                      </Row>
                    </Col>
                    {
                      index != 0 ? (<Col s="2" l="2">
                        <Button onClick={() => this.deleteContact(index, 'phonelits')}>删除</Button>
                                    </Col>)
                      :
                      null
                    }
                  </Row>
                ))
              : null}


              {/* 添加按钮 */}
              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel} />

                <Col s="12" l="10">
                  <Button type="primary" onClick={() => this.addContact('phonelits')}>添加公司信息</Button>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col s="12" l="12" style={styles.formLabel}>
                  <Row style={styles.formItem}>
                    <Col s="4" l="8">导入联系人：</Col>
                    <Col s="12" l="12">
                      <IceFormBinder name="leader" required={false}>
                        <Input
                          style={{
                            width: '100%',
                          }}
                          placeholder="请输入联系人"
                        />
                      </IceFormBinder>
                      <IceFormError name="leader" />
                    </Col>
                  </Row>
                </Col>
                <Col s="10" l="10" style={styles.formLabel}>
                  <Row style={styles.formItem}>
                    <Col s="5" l="10">导入联系方式：</Col>
                    <Col s="12" l="12">
                      <IceFormBinder name="phone" required={false}>
                        <Input
                          style={{
                            width: '100%',
                          }}
                          placeholder="请输入联系方式"
                        />
                      </IceFormBinder>
                      <IceFormError name="phone" />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司地址：
                </Col>

                <Col s="12" l="16">
                  <Row>
                    <IceFormBinder type="string" name="address" required={false} message="公司地址必须填写">
                      <Search
                        onSearch={this.onAddressSearch.bind(this)}
                        onChange={this.onAddressChange.bind(this)}
                        dataSource={this.state.mapDataSource.dataSource}
                        searchText="搜索地址"
                        autoWidth
                      />
                    </IceFormBinder>
                    <IceFormError name="address" />
                  </Row>
                  <Row>
                    <Map style={styles.mapStyle} mapSource={this.state.mapDataSource} mapNormal={this.onMapNormal.bind(this)} />
                  </Row>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col s="12" l="12" style={styles.formLabel}>
                  <Row style={styles.formItem}>
                    <Col s="4" l="8">公司经度：</Col>
                    <Col s="12" l="12">
                      <IceFormBinder name="longitude" required={false} message="公司经度必须填写">
                        <Input style={{
                              width: '100%',
                            }}
                          disabled
                        />
                      </IceFormBinder>
                      <IceFormError name="longitude" />
                    </Col>
                  </Row>
                </Col>
                <Col s="12" l="12" style={styles.formLabel}>
                  <Row style={styles.formItem}>
                    <Col s="4" l="8">公司纬度：</Col>
                    <Col s="12" l="12">
                      <IceFormBinder name="latitude" required={false} message="公司纬度必须填写">
                        <Input style={{
                              width: '100%',
                            }}
                          disabled
                        />
                      </IceFormBinder>
                      <IceFormError name="latitude" />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  前台显示：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="status">
                    <SwitchForForm defaultValue={this.state.status} />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  是否推荐：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="is_recommend">
                    <SwitchForForm defaultValue={this.state.is_recommend} />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  大宗货物：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="mass_goods" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入大宗货物"
                    />
                  </IceFormBinder>
                  <IceFormError name="mass_goods" />
                </Col>
              </Row>

              {
                this.state.propties == 2 ?
                (<div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      仓储平方：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="cc_area" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入仓储平方"
                        />
                      </IceFormBinder>
                      <IceFormError name="cc_area" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      仓储类型：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="cc_type" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入仓储类型"
                        />
                      </IceFormBinder>
                      <IceFormError name="cc_type" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      进仓电话：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="go_phone" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入进仓电话"
                        />
                      </IceFormBinder>
                      <IceFormError name="go_phone" />
                    </Col>
                  </Row>
                 </div>) :
                null
              }

              {
                this.state.propties == 3 ?
                (<div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      冷链仓储平方：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="ll_area" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入冷链仓储平方"
                        />
                      </IceFormBinder>
                      <IceFormError name="ll_area" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      冷链仓储类型：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="ll_type" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入冷链仓储类型"
                        />
                      </IceFormBinder>
                      <IceFormError name="ll_type" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      冷链仓库：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="ll_lib" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入冷链仓库"
                        />
                      </IceFormBinder>
                      <IceFormError name="ll_lib" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      冷链车辆：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="ll_car" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入冷链车辆"
                        />
                      </IceFormBinder>
                      <IceFormError name="ll_car" />
                    </Col>
                  </Row>
                 </div>) :
                null
              }

              {
                this.state.propties == 4 ?
                (<div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      危化仓储平方：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="wh_area" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入危化仓储平方"
                        />
                      </IceFormBinder>
                      <IceFormError name="wh_area" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      危化仓储类型：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="wh_type" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入危化仓储类型"
                        />
                      </IceFormBinder>
                      <IceFormError name="wh_type" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      危化仓库：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="wh_lib" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入危化仓库"
                        />
                      </IceFormBinder>
                      <IceFormError name="wh_lib" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      危化车辆：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="wh_car" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入危化车辆"
                        />
                      </IceFormBinder>
                      <IceFormError name="wh_car" />
                    </Col>
                  </Row>
                 </div>) :
                null
              }

              {
                this.state.propties == 5 ?
                (<div>
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      网点仓库：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="wd_lib" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入网点仓库"
                        />
                      </IceFormBinder>
                      <IceFormError name="wd_lib" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                      网点车辆：
                    </Col>

                    <Col s="12" l="10">
                      <IceFormBinder name="wd_car" required={false}>
                        <Input style={{
                            width: '100%',
                          }}
                          placeholder="请输入网点车辆"
                        />
                      </IceFormBinder>
                      <IceFormError name="wd_car" />
                    </Col>
                  </Row>
                 </div>) :
                null
              }

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  网址：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="web_address" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入网址"
                    />
                  </IceFormBinder>
                  <IceFormError name="web_address" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  邮箱：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="email" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入邮箱"
                    />
                  </IceFormBinder>
                  <IceFormError name="email" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  投诉电话：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="ts_phone" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入投诉电话"
                    />
                  </IceFormBinder>
                  <IceFormError name="ts_phone" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  仓储特色：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="shopstore" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入仓储特色"
                    />
                  </IceFormBinder>
                  <IceFormError name="shopstore" />
                </Col>
              </Row>


              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  积分：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="integral" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="请输入大于0的积分数"
                    />
                  </IceFormBinder>
                  <IceFormError name="integral" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  排序：
                </Col>

                <Col s="12" l="10">
                  <IceFormBinder name="displayorder" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      placeholder="数字越小越靠前"
                    />
                  </IceFormBinder>
                  <IceFormError name="displayorder" />
                </Col>
              </Row>

              <Row style={styles.formText}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司简介：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="intro" required={false}>
                    <Input style={{
                        width: '100%',
                      }}
                      multiple
                      placeholder="请输入公司简介"
                    />
                  </IceFormBinder>
                  <IceFormError name="intro" />
                </Col>
              </Row>

              <Row style={styles.richItem}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel}>
                  公司详情：
                </Col>
                <Col s="18" l="18">
                  <div style={styles.richText}>
                    <BraftEditor {...editorProps} ref={instance => this.editorInstance = instance} />
                  </div>

                </Col>
              </Row>


              <Row style={styles.btns}>
                <Col xxs="6" s="2" l="4" style={styles.formLabel} />
                <Col s="12" l="10">
                  <Button type="primary" onClick={this.submit}>
                    {this.props.history.params.activityId != 'create' ? '保存' : '立即创建'}
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
    paddingBottom: 0,
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px',
  },
  formText: {
    marginBottom: '25px',
  },
  imgPadding: {
    paddingBottom: '25px',
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
  richItem: {
    marginBottom: '25px',
  },
  richText: {
    border: '1px solid #DCDEE3',
    borderRadius: '4px',
    width: '100%',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
  mapStyle: {
    width: '100%',
    height: '500px',
    marginTop: '25px',
    marginBottom: '25px',
  },
};
