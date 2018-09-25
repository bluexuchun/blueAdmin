/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';
// import SubCategoryItem from './SubCategoryItem';
// import './ComplexTabTable.scss';
import { Link } from 'react-router'
import { ajaxTo } from '../../../../util/util';
import Img from '@icedesign/img';
import { connect } from 'react-redux'

const aStyle={
  display:"inline-block",
  color:"#5485F7",
  marginLeft:"1rem",
  cursor:'pointer'
}
const onRowClick = function(record, index, e) {
    console.log(record)

}

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "路线列表", key: 0, content: "/activityClassList"},
];

@connect(
  state => ({user:state.user})
)

export default class ComplexClassTable extends Component {
  static displayName = 'ComplexClassTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      isHot: false,
      currentTab: 'solved',
      currentCategory: '1',
      // 分页
      pageManage:{
        currentPage:1,
        pageSize:5,
        total:50,
      }
    };
  }



  componentWillMount(){
    const id = this.props.newData.history.params.pid;
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=logistics&a=route&do=display',{
      pid:id
    });
    result.then(function(res){
      console.log(res.data)

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

  deleteId = (id) => {
    const result = ajaxTo('api.php?entry=sys&c=route&a=list&do=display',{
      pid:id,
      person:this.props.user.admin
    });
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
  editItem = (record, e) => {
    e.preventDefault();
  };

  renderOperations = (value, index, record) => {
    console.log(this.props);
    const pid = this.props.newData.history.params.pid;
    console.log(record);
    const toUrl = '/activityClass/'+record.id+'/'+pid;
    return (
      <div style={styles.complexTabTableOperation}>
        <Link to={toUrl}>编辑</Link>
        <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this,record.id)}>删除</div>
      </div>
    );
  };

  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

  };

  tabClick = (key) => {
    // const url = tabs[key].content;
    // console.log(url);
    // this.props.newData.history.router.push(url);
  }

  onSubCategoryClick = (catId) => {
    this.setState({
      currentCategory: catId,
    });
    this.queryCache.catId = catId;
    this.fetchData();
  };

  renderTabBarExtraContent = () => {
    return (
      <div style={styles.tabExtra}>
        <Search
          style={styles.search}
          type="secondary"
          placeholder="搜索"
          searchText=""
          onSearch={this.onSearch}
        />
      </div>
    );
  };

  newRender = (value, index, record) => {
    return <a>操作</a>;
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
    console.log(forData);

    const arr=[];

    if(forData){
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'id':forData[i].id,
          'company':forData[i].line_company,
          'address':forData[i].line_address,
          'oricity':forData[i].origin_city,
          'detcity':forData[i].dest_city,
          'publishTime':forData[i].createtime,
          'publishStatus':forData[i].is_hot == '1'?'开启':'关闭',
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
        <IceContainer>
          <Tab onChange={this.tabChange}>
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
            onRowClick={onRowClick}
          >
            <Table.Column
              title="id"
              width={60}
              dataIndex="id"
            />
            <Table.Column
              title="公司名称"
              dataIndex="type"
              width={100}
              dataIndex="company"
            />
            <Table.Column
              title="公司地址"
              dataIndex="type"
              width={150}
              dataIndex="address"
            />
            <Table.Column
              title="起始城市"
              dataIndex="type"
              width={100}
              dataIndex="oricity"
            />
            <Table.Column
              title="目的城市"
              dataIndex="type"
              width={100}
              dataIndex="detcity"
            />
            <Table.Column
              title="状态"
              dataIndex="publishStatus"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
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
};
