import React, { Component } from 'react';
import ComplexClassTable from './components/ComplexClassTable';
import { ajaxTo } from '../../util/util';
export default class ActivityClassList extends Component {
static displayName = 'ActivityClassList';

  constructor(props) {
    super(props);
    this.state = {
      // updateUrl:'api.php?entry=sys&c=app&a=regulation&do=display',

    };
  }

  // componentWillMount(){
  //   console.log(this.props);
  //   const that=this;
  //   const result = ajaxTo('api.php?entry=sys&c=app&a=regulation&do=dispaly');
  //   result.then(function(res){
  //     console.log(res.data)
  //
  //     that.setState({
  //       allData:res.data
  //     });
  //   })
  // }
  render() {
    const newAry = {'history':this.props};
    console.log(this.state.allData)
    return (
      <div className="activity-list-page">
        <ComplexClassTable newData={newAry}/>
      </div>
    );
  }
}
