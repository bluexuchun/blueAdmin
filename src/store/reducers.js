
// reducers.js
//工具函数，用于组织多个reducers,并返回reducer集合
import { combineReducers } from 'redux';
import { user } from './user.redux';
import { settingDate } from './setting.redux';

export default combineReducers({user,settingDate})
