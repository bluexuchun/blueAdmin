/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid } from '@icedesign/base';
import Img from '@icedesign/img';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import { uploadUrl,ajaxTo } from '../../../../util/util';
import { Feedback } from '@icedesign/base';
import { connect } from 'react-redux';
import { display,edit } from '../../../../store/setting.redux';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;
const { ImageUpload } = Upload;
const { CropUpload } = Upload;



function onChange(info) {
  console.log('onChane callback : ', info);
}


function onSuccessAll(res, file){
  console.log('onSuccess allimg callback : ', res, file);
}

function onError(file) {
  console.log('onError callback : ', file);
}

@connect(
  state=>({setting:state.settingDate}),
  {display,edit}
)
export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      logoImg:'',
      allImg:'',
      description:'',
      uploadUrl:{uploadUrl},
      value:{
        siteTitle:'',
      }
    };
  }

  componentWillMount(){
    this.props.display();
    console.log(this.props.setting);

  }

  componentDidMount(){
    this.setState({
      logoImg:this.props.setting.logo,
      allImg:this.props.setting.commonbg,
      description:this.props.setting.description,
      value:{
        siteTitle:this.props.setting.siteTitle,
      }
    })
    this.editorInstance.setContent(this.props.setting.description, 'html')
  }

  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;
    this.setState({
      logoImg: logoImg
    })
  }

  onSuccessAll = (res, file) => {
    Feedback.toast.success('上传成功');
    const imgUrl = 'http://' + res.imgURL;
    this.setState({
      allImg: imgUrl
    })
  }

  onDragOver = () => {
    console.log('dragover callback');
  }

  onDrop = (fileList) => {
    console.log('drop callback : ', fileList);
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  }

  validateAllFormField = () => {
    const that = this;
    this.refs.form.validateAll((errors, values) => {
      let list = {...values,logoImg:that.state.logoImg,allImg:that.state.allImg,description:that.state.description};
      this.props.edit(list);
    });
  }

  uploadMedia = (param) => {
    const serverURL = uploadUrl
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
    console.log(param.libraryId)

    const successFn = (response) => {
      const result = eval('('+xhr.responseText+')');
      const imgUrl = 'http://'+result.imgURL;
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

  richTextOnchange = (value) => {
    this.setState({
      description:value
    })
  }

  render() {
    // 富文本的配置
    const editorProps = {
      height: 400,
      contentFormat: 'html',
      placeholder: '关于我们...',
      onChange: this.richTextOnchange,
      onRawChange: this.handleRawChange,
      media:{
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
      }
    }

    return (
      <div className="settings-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>基本设置</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  LOGO：
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
                      action={this.state.uploadUrl}
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                      name="filename"
                      beforeUpload={this.beforeUpload}
                      onSuccess={this.onSuccess}
                      onError={onError}
                    >
                    {this.state.logoImg ?
                      <Img
                        width={120}
                        height={120}
                        src={this.state.logoImg}
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
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  全局背景图：
                </Col>
                <Col s="12" l="10">
                    <Upload
                      style={{
                        display: "block",
                        textAlign: "center",
                        width: "640px",
                        height: "360px",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "12px"
                      }}
                      action={this.state.uploadUrl}
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                      name="filename"
                      beforeUpload={this.beforeUpload}
                      onSuccess={this.onSuccessAll}
                      onError={onError}
                    >
                      {this.state.allImg ?
                        <Img
                          width={640}
                          height={360}
                          src={this.state.allImg}
                          type="cover"
                          style={{
                            borderRadius:"5px"
                          }}
                        />
                        :
                        <div style={{ width:"640px",height:"360px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",border:"1px dashed #aaa",borderRadius:"5px"}}>
                          <div style={{ color:"#3080FE",fontSize:"30px",width:"100%",textAlign:"center"}}>+</div>
                          <div style={{ color:"#3080FE",fontSize:"14px",width:"100%",textAlign:"center"}}>上传图片</div>
                        </div>
                      }
                    </Upload>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  网站标题 ：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder
                    name="siteTitle"
                    required
                    message="请输入网站标题"
                  >
                    <Input
                      size="large"
                      placeholder="请输入网站标题"
                    />
                  </IceFormBinder>
                  <IceFormError
                    style={{ marginLeft: 10 }}
                    name="siteTitle"
                    required
                    message="请输入网站标题"
                  />
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row style={styles.formItem}>
            <Col xxs="6" s="3" l="3" style={styles.label}>
              关于我们：
            </Col>
            <Col s="18" l="18">
              <div style={styles.richText}>
                  <BraftEditor {...editorProps} ref={(instance) => this.editorInstance = instance} />
              </div>

            </Col>
          </Row>

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
  richText: {
    border:'1px solid #DCDEE3',
    borderRadius:'4px',
    width:'100%',
    boxShadow:'0 10px 20px rgba(0,0,0,0.1)'
  }
};
