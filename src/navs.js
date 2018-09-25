// <!-- auto generated navs start -->
const autoGenHeaderNavs = [];
const autoGenAsideNavs = [];

// <!-- auto generated navs end -->

const customHeaderNavs = [
  {
    text: '首页',
    to: '/',
    icon: 'home',
  }
];

const customAsideNavs = [
  {
    name:'index',
    text: '首页',
    to: '/Home',
    icon: 'home'
  },
  {
    name:'userManage',
    text: '用户管理',
    to: '/userManagePage',
    icon: 'fans',
  },
  {
    name:'bannerManage',
    text: '轮播图管理',
    to: '/banner',
    icon: 'ol-list',
    children: [
      {
        name:'bannerEdit',
        text: '轮播图编辑',
        to: '/banner/bannercreate'
      },
      {
        name:'bannerList',
        text: '轮播图列表',
        to: '/bannerList'
      }
    ]
  },
  {
    name:'companyManage',
    text: '公司管理',
    to: '/activity',
    icon: 'shop',
    children: [
      {
        name:'companyAdd',
        text: '公司添加',
        to: '/activity/create',
      },
      {
        name:'companyList',
        text: '公司列表',
        to: '/activityList'
      },

    ]
  },
  {
    name:'goodManage',
    text:'商家管理',
    icon:'store',
    children: [
      {
        name:'goodEdit',
        text:'商家编辑',
        to:'/goodEditPage/create'
      },
      {
        name:'goodList',
        text:'商家列表',
        to:'/goodListPage'
      }
    ]
  },
  {
    name:'advManage',
    text:'广告管理',
    icon:'light',
    children: [
      {
        name:'advEdit',
        text:'广告添加',
        to:'/advEditPage'
      },
      {
        name:'advList',
        text:'广告列表',
        to:'/advListPage'
      }
    ]
  },
  {
    name:'categoryManage',
    text:'分类管理',
    icon:'cascades',
    children: [
      {
        name:'categoryEdit',
        text:'分类添加',
        to:'/categoryEditPage/create'
      },
      {
        name:'categoryList',
        text:'分类列表',
        to:'/categoryListPage'
      }
    ]
  },
  {
    name:'authorManage',
    text: '权限管理',
    icon: 'yonghu',
    children: [
      {
        name:'userAuthority',
        text:'权限列表',
        to: '/userAuthority',
      },
      {
        name:'roleList',
        text:'角色权限列表',
        to: '/roleListPage',
      },
      {
        name:'roleEdit',
        text:'角色权限编辑',
        to: '/roleEditPage/create',
      },
    ]
  },
  {
    name:'settingManage',
    text: '系统设置',
    to: '/setting',
    icon: 'shezhi',
    children: [
      {
        name:'settingEdti',
        text: '基本设置',
        to: '/setting',
      },
      {
        name:'attachment',
        text: '附件设置',
        to: '/comment',
      },
    ],
  },
];

function transform(navs) {
  // custom logical
  return [...navs];
}

export const headerNavs = transform([
  ...autoGenHeaderNavs,
  ...customHeaderNavs,
]);

export const asideNavs = transform([...autoGenAsideNavs, ...customAsideNavs]);
export const originNavs = [...customAsideNavs];
