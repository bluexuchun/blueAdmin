import React, { Component } from 'react';
import { Table, Pagination, Balloon, Icon,Feedback } from '@icedesign/base';
import { baseUrl,ajaxTo } from '../../../../util/util';
import Img from '@icedesign/img';


export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: [],
      pageManage:{
        currentPage:1,
        pageSize:5,
        total:50,
      }
    };
  }

  componentWillMount() {
    const that = this;
    let result = ajaxTo('api.php?entry=sys&c=logistics&a=user&do=display',{})
    .then((res) => {
      console.log(res)
      if(res.status == 1){
        let pageManage = {...that.state.pageManage};

        pageManage.pageSize = res.data.psize;
        pageManage.total = res.data.total;


        that.setState({
          dataSource:res.data.lists,
          pageManage:pageManage
        })

      }
    })
  }

  handlePagination = (current) => {
    this.setState({
      current,
    });
  };

  handleSort = (dataIndex, order) => {
    const dataSource = this.state.dataSource.sort((a, b) => {
      const result = a[dataIndex] - b[dataIndex];
      if (order === 'asc') {
        return result > 0 ? 1 : -1;
      }
      return result > 0 ? -1 : 1;
    });

    this.setState({
      dataSource,
    });
  };

  // 头像
  avatarImg = (value) => {
    return (
      <div>
        <Img src={value} style={{borderRadius: '50%'}} width={70} height={70}></Img>
      </div>
    )
  }

  // 分页逻辑
  changePage = (page) => {

    const that = this;

    const result = ajaxTo('api.php?entry=sys&c=logistics&a=user&do=display',{
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

    // 分页
    const tableData = {
      'currentPage':this.state.pageManage.currentPage,
      'pageSize':this.state.pageManage.pageSize,
      'total':this.state.pageManage.total,
      'data':this.state.dataSource
    }

    return (
      <div style={styles.tableContainer}>
        <Table
          dataSource={tableData.data}
          onSort={this.handleSort}
          hasBorder={false}
          className="custom-table"
        >
          <Table.Column
            width={130}
            lock="left"
            title="用户Id"
            dataIndex="id"
            sortable
            align="center"
          />
          <Table.Column width={150} title="昵称" dataIndex="nickname" />
          <Table.Column width={200} title="openid" dataIndex="openid" />
          <Table.Column width={200} title="头像" dataIndex="avatarurl" cell={this.avatarImg} />
          <Table.Column width={200} title="创建时间" dataIndex="createtime" />
        </Table>
        <div style={styles.pagination}>
          <Pagination
            current={tableData.currentPage}
            pageSize={tableData.pageSize}
            total={tableData.total}
            onChange={this.changePage.bind(this)}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  tableContainer: {
    background: '#fff',
    paddingBottom: '10px',
  },
  pagination: {
    margin: '20px 0',
    textAlign: 'center',
  },
  editIcon: {
    color: '#999',
    cursor: 'pointer',
  },
  circle: {
    display: 'inline-block',
    background: '#28a745',
    width: '8px',
    height: '8px',
    borderRadius: '50px',
    marginRight: '4px',
  },
  stateText: {
    color: '#28a745',
  },
};
