/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search, Dialog, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';
import { Link } from 'react-router'
import { baseUrl,ajaxTo } from '../../../../util/util';
import Img from '@icedesign/img';


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
  { tab: "热门城市列表", key: 0, content: "/hotCityListPage"},
  { tab: "热门城市编辑", key: 1, content: "/hotCityEditPage/cityId"},
];

export default class SortableTable extends Component {
  static displayName = 'BannerTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
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
    const that=this;
    const result = ajaxTo('api.php?entry=sys&c=logistics&a=city_hot&do=display');
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

  // 删除
  deleteId = (id) => {
    Dialog.confirm({
      content: "是否确认要删除？",
      title: "警告",
      onOk: () => {
        const result = ajaxTo('api.php?entry=sys&c=logistics&a=city_hot&do=delete',{'id':id});
        result.then((res) => {
          if(res.status == 1){
            let oldData=this.state.allData;
            for (var i = 0; i < oldData.length; i++) {
              if(oldData[i].id==id){
                oldData.splice(i,1);
                this.setState({
                  allData:oldData
                })
              }
            }
            Feedback.toast.success('删除成功');
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
    const toUrl = '/hotCityEditPage/'+record.id;
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

  renderCate = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    )
  }

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    this.props.history.router.push(url);
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

  getIcon = (appicon) => {
    if(appicon){
      appicon = baseUrl + appicon;
    }

    return (
      <img src={appicon} style={{width:'80px'}} className="media-side" />
    )
  }

  // 分页逻辑
  changePage = (page) => {

    const that = this;

    const result = ajaxTo('api.php?entry=sys&c=logistics&a=city_hot&do=display',{
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
          'id':forData[i].id,
          'name':forData[i].name,
          'displayorder':forData[i].displayorder,
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
              title="Id"
              width={120}
              dataIndex="id"
            />

            <Table.Column
              title="标题"
              width={120}
              dataIndex="name"
            />

            <Table.Column
              title="排序"
              dataIndex="displayorder"
              width={150}
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
