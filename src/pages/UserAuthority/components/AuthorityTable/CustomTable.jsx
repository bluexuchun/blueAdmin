import React, { Component } from 'react';
import { Table, Pagination, Balloon, Icon, Dialog } from '@icedesign/base';
import { Link } from 'react-router';
import axios from 'axios';
import uploadUrl,{ajaxTo,ajaxCors} from '../../../../util/util';

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: []
    };
  }

  componentWillMount() {
    const that = this;
    let userList = ajaxTo('api.php?entry=sys&c=admin&a=list',{})
    .then((res) => {
      console.log(res);
      if(res.status == 1){
        let dataSource = [...that.state.dataSource];
        dataSource = res.data.lists;
        that.setState({
          dataSource:dataSource
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

  renderState = (value) => {
    console.log(value);
    return (
      <div style={styles.state}>
        <span style={styles.circle} />
        <span style={styles.stateText}>{value == 0 ? '关闭' : '开启'}</span>
      </div>
    );
  };

  deleteUser = (key) => {
    const id = key;
    // 确认按钮
    Dialog.confirm({
      content: "是否确认要删除？",
      title: "警告",
      onOk: () => {
        ajaxTo('api.php?entry=sys&c=admin&a=list&do=delete',{'id':id});
        let oldData=this.state.dataSource;
        for (var i = 0; i < oldData.length; i++) {
          if(oldData[i].id==id){
            oldData.splice(i,1);
            this.setState({
              allData:oldData
            })
          }
        }
      },
      onCancel: () => {
        console.log('cancel');
      }
    });
  }

  renderOper = (value, index,record) => {
    const url = '/userEditPage/'+record.id;
    return (
      <div style={styles.oper}>
        <Link to={url}>
          <Icon type="edit" size="small" style={styles.editIcon} />
        </Link>
        <Link onClick={this.deleteUser.bind(this,record.id)} style={{cursor:'pointer',marginLeft:'15px'}}>删除</Link>
      </div>
    );
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div style={styles.tableContainer}>
        <Table
          dataSource={dataSource}
          hasBorder={false}
          className="custom-table"
        >
          <Table.Column
            width={100}
            lock="left"
            title="Id"
            dataIndex="id"
            align="center"
          />
          <Table.Column width={100} title="名字" dataIndex="name"/>
          <Table.Column
            width={200}
            title="状态"
            dataIndex="status"
            cell={this.renderState}
          />
          <Table.Column
            width={100}
            title="操作"
            cell={this.renderOper}
            lock="right"
            align="center"
          />
        </Table>
        <Pagination
          style={styles.pagination}
          current={this.state.current}
          onChange={this.handlePagination}
          total={1}
          pageShowCount={1}
        />
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
