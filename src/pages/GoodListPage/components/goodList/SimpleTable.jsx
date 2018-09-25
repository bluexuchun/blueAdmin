/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search, Dialog, Select,Feedback,Input,Button } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';
import './ComplexTabTable.scss';
import { Link } from 'react-router'
import { ajaxTo,baseUrl } from '../../../../util/util';
import Img from '@icedesign/img';
import { connect } from 'react-redux'

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "公司列表", key: 0, content: "/activityList"},
  { tab: "公司编辑", key: 1, content: "/activity/create"},
];

@connect(
  state => ({user:state.user})
)

export default class SimpleTable extends Component {
  static displayName = 'SimpleTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1',
      // 搜索内容
      search:{

      },
      // Dialog
      visible: false,
      // 分页
      pageManage:{
        currentPage:1,
        pageSize:5,
        total:50,
      }
    };
  }



  componentWillMount(){
    const that=this;
    const result = ajaxTo('api.php?entry=sys&c=store&a=store&do=display');
    result.then(function(res){
      console.log(res);
      let pageManage = {...that.state.pageManage};

      pageManage.pageSize = res.data.psize;
      pageManage.total = res.data.total;

      that.setState({
        allData:res.data.lists,
        pageManage:pageManage
      });
    })
  }

  componentDidMount(){

  }

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.newData.history.router.push(url);
  }


  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <div>
          <IceImg src={record.cover} width={48} height={48} />
        </div>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };

  // 删除操作
  deleteId = (id) => {

    // 确认按钮
    Dialog.confirm({
      content: "是否确认要删除？",
      title: "警告",
      onOk: () => {
        ajaxTo('api.php?entry=sys&c=store&a=store&do=delete',{
          id:id,
          person:this.props.user.admin
        })
        .then((res) => {
          if(res.status == 1){
            Feedback.toast.success('删除成功');
            let oldData=this.state.allData;
            for (var i = 0; i < oldData.length; i++) {
              if(oldData[i].id==id){
                oldData.splice(i,1);
                this.setState({
                  allData:oldData
                })
              }
            }
          }
        })

      },
      onCancel: () => {
        console.log('cancel');
      }
    });
  }

  editItem = (record, e) => {
    e.preventDefault();
  };

  renderOperations = (value, index, record) => {
    const toUrl = '/goodEditPage/'+record.id;
    return (
      <div style={styles.complexTabTableOperation}>
        <Link to={toUrl}>编辑</Link>
        <div style={styles.linkStyle} data-id={record.id} onClick={this.deleteId.bind(this,record.id)}>删除</div>
      </div>
    );
  };

  onSelect = (id,value) => {
    console.log(id);
    console.log(value);
    // 确认按钮
    Dialog.confirm({
      content: "是否确认状态",
      title: "确认",
      onOk: () => {
        ajaxTo('api.php?entry=sys&c=logistics&a=company&do=check',{'id':id,'is_checked':value})
        .then((res) => {
          console.log(res)
          if(res.status == 1){
            Feedback.toast.success('保存成功');
          }
        })
      },
      onCancel: () => {
        console.log('cancel');
      }
    });
  }

  renderStatus = (value,index,record) => {
    let id = record.id;
    return (
      <IceLabel inverse={false} status="default" style={{fontSize: '14px'}}>
        {value == 1 ? '待审核' : value == 2 ? '审核通过' : '审核失败'}
      </IceLabel>
    );
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

  };

  onSubCategoryClick = (catId) => {
    this.setState({
      currentCategory: catId,
    });
    this.queryCache.catId = catId;
    this.fetchData();
  };

  getIcon = (logo) => {
    return (
      <img src={logo} style={{width:'80px'}} className="media-side" />
    )
  }

  // 搜索改变
  searchChange = (name,value) => {
    let search = {...this.state.search};
    search[name] = value;
    this.setState({
      search:search
    })
  }

  searchSelectChange = (value) => {
    let search = {...this.state.search};
    search['searchStatus'] = value;
    this.setState({
      search:search
    })
  }


  // 搜索结果
  onSearch = () => {
    const that = this;

    const result = ajaxTo('api.php?entry=sys&c=logistics&a=company&do=display',{
      ...this.state.search
    });
    result.then(function(res){
      console.log(res);

      let pageManage = {...that.state.pageManage};
      pageManage.pageSize = res.data.psize;
      pageManage.total = res.data.total;

      that.setState({
        allData:res.data.lists,
        pageManage:pageManage
      })
    })
  }


  // 排序
  handleSort = (dataIndex, order) => {
    const allData = this.state.allData.sort((a, b) => {
      const result = a[dataIndex] - b[dataIndex];
      if (order === 'asc') {
        return result > 0 ? 1 : -1;
      }
      return result > 0 ? -1 : 1;
    });

    this.setState({
      allData,
    });
  };


  // 分页逻辑
  changePage = (page) => {

    const that = this;

    const result = ajaxTo('api.php?entry=sys&c=store&a=store&do=display',{
      page:page
    });

    let pageManage = {...this.state.pageManage};
    pageManage.currentPage = page;

    result.then(function(res){
      that.setState({
        allData:res.data.lists,
        pageManage:pageManage
      });
    })

  }

  render() {
    let forData=this.state.allData;
    const arr=[];
    if(forData){
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'name':forData[i].store_name,
          'contact':forData[i].contact,
          'address':forData[i].address,
          'id':forData[i].id,
          'logo_path':forData[i].logo,
          'status':forData[i].state ? forData[i].state : 1,
        })
      }
    }

    // 分页
    const tableData = {
      'currentPage':this.state.pageManage.currentPage,
      'pageSize':this.state.pageManage.pageSize,
      'total':this.state.pageManage.total,
      'data':arr
    }

    const { tabList } = this.state;

    return (
      <div className="complex-tab-table">
        {/*<div style={styles.tableFilter}>
          <div style={styles.title}>商家查询</div>
          <div style={styles.filter}>
            <div style={styles.filterItem}>
              <span style={styles.filterLabel}>商家名称：</span>
              <Input onChange={this.searchChange.bind(this,'searchCompany')}/>
            </div>
            <div style={styles.filterItem}>
              <span style={styles.filterLabel}>审核状态：</span>
              <Select style={{ width: '200px' }} onChange={this.searchSelectChange.bind(this)}>
                <Select.Option value="2">全部</Select.Option>
                <Select.Option value="1">已审核</Select.Option>
                <Select.Option value="3">未审核</Select.Option>
              </Select>
            </div>
            <Button type="primary" style={styles.submitButton} onClick={this.onSearch.bind(this)}>
              查询
            </Button>
          </div>
        </div>*/}
        <IceContainer>
          <Tab>
            {tabs.map(item => (
              <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

              </TabPane>
            ))}
          </Tab>
          <Table
            dataSource={tableData.data}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
            onSort={this.handleSort}
          >
          <Table.Column
            title="商家Id"
            width={80}
            dataIndex="id"
            sortable
          />
          <Table.Column
            title="商家名称"
            width={120}
            dataIndex="name"
          />
          <Table.Column
            title="logo"
            dataIndex="type"
            width={100}
            dataIndex="logo_path"
            cell={this.getIcon}
          >
          </Table.Column>
          <Table.Column
            title="商家地址"
            dataIndex="address"
            width={150}
          />
          <Table.Column
            title="审核情况"
            dataIndex="status"
            width={100}
            cell={this.renderStatus}
          />
          <Table.Column
            title="操作"
            dataIndex="operation"
            width={200}
            cell={this.renderOperations}
          />
          </Table>
          <div style={styles.pagination}>
            <Pagination
              current={tableData.currentPage}
              pageSize={tableData.pageSize}
              total={tableData.total}
              onChange={this.changePage.bind(this)}
            />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  complexTabTableOperation: {
    lineHeight: '28px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    color:'#5485F7'
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px',
  },
  operation: {
    marginRight: '12px',
    textDecoration: 'none',
  },
  tabExtra: {
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    marginLeft: 10,
  },
  tabCount: {
    marginLeft: '5px',
    color: '#3080FE',
  },
  pagination: {
    textAlign: 'right',
    paddingTop: '26px',
  },
  linkStyle:{
    marginLeft:'10px',
    cursor:'pointer',
  },
  tableFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    marginBottom: '20px',
    background: '#fff',
  },
  title: {
    height: '20px',
    lineHeight: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    paddingLeft: '12px',
    borderLeft: '4px solid #666',
  },
  filter: {
    display: 'flex',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  },
  filterLabel: {
    fontWeight: '500',
    color: '#999',
  },
  submitButton: {
    marginLeft: '20px',
  },
  creditPadding:{
    boxSizing:'border-box',
    padding:'10px 5px',
    display:'flex',
    flexDirection:'column'
  },
  creditTitle:{
    padding:'10px 0px'
  },
  creditTips:{
    padding:'8px 0px',
    fontSize:'13px',
    color:'#999'
  }
};
