/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import React, { Component } from 'react';
import cx from 'classnames';
import Layout from '@icedesign/layout';
import { Icon } from '@icedesign/base';
import Menu, { SubMenu, Item as MenuItem } from '@icedesign/menu';
import { Link } from 'react-router';
import FoundationSymbol from 'foundation-symbol';
import { enquire } from 'enquire-js';
import { connect } from 'react-redux';
import Header from './../../components/Header';
import Footer from './../../components/Footer';
import Logo from './../../components/Logo';
import { asideNavs } from './../../navs';
import './scss/light.scss';
import './scss/dark.scss';

// 设置默认的皮肤配置，支持 dark 和 light 两套皮肤配置
const theme = typeof THEME === 'undefined' ? 'dark' : THEME;

@connect(
  state=>({user:state.user})
)



export default class HeaderAsideFooterResponsiveLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    const openKeys = this.getOpenKeys();
    this.state = {
      collapse: false,
      openDrawer: false,
      isScreen: undefined,
      openKeys,
      newList:[],
      authorityLists:asideNavs
    };
    this.openKeysCache = openKeys;
  }
  componentWillMount() {

  }
  componentDidMount() {
    this.enquireScreenRegister();
  }

  authority = (array) => {
    let keyList = [];

    let asideNavsList = this.state.authorityLists;

    asideNavsList.map((v,i) => {
      delete asideNavsList[i].status;
      if(v.children){
        v.children.map((vv,ii) => {
          delete asideNavsList[ii].status;
        })
      }
    })

    let newAry = array;

    newAry.map((v,i) => {
      // 如果mname == aname 转换成键值取出来
      if(v.mname == v.aname){
        keyList.push(v.mname);
        delete newAry[i];
      }
    })

    keyList.map((v,i) => {
      newAry.map((vv,ii) => {
        if(v == vv.mname){
          delete newAry[ii];
        }
      })
    })

    keyList.map((v,i) => {
      asideNavsList.map((vv,ii) => {
        if(v == vv.name){
          asideNavsList[ii].status = true;
        }
      })
    })

    newAry.map((v,i) => {
      asideNavsList.map((vv,ii) => {
        // 如果不相等 则去匹配mname == name 再去匹配 children和 aname
        if(v.mname == vv.name){
          if(vv.children){
            vv.children.map((vvi,ivi) => {
              if(v.aname == vvi.name){
                asideNavsList[ii].status = 'hasChildren';
                asideNavsList[ii].children[ivi].status = true;
              }
            })
          }
        }
      })
    })


    // 重新整理数组
    // asideNavsList.map((v,i) => {
    //   if(v.status == true){
    //
    //   }else if(v.status == 'hasChildren'){
    //     v.children.map((vv,ii) => {
    //       if(vv.status == true){
    //
    //       }else{
    //         delete asideNavsList[i].children[ii];
    //       }
    //     })
    //   }else{
    //     delete asideNavsList[i]
    //   }
    //
    // })

    return asideNavsList;
  }
  /**
   * 注册监听屏幕的变化，可根据不同分辨率做对应的处理
   */
  enquireScreenRegister = () => {
    const isMobile = 'screen and (max-width: 720px)';
    const isTablet = 'screen and (min-width: 721px) and (max-width: 1199px)';
    const isDesktop = 'screen and (min-width: 1200px)';

    enquire.register(isMobile, this.enquireScreenHandle('isMobile'));
    enquire.register(isTablet, this.enquireScreenHandle('isTablet'));
    enquire.register(isDesktop, this.enquireScreenHandle('isDesktop'));
  };

  enquireScreenHandle = (type) => {
    let collapse;
    if (type === 'isMobile') {
      collapse = false;
    } else if (type === 'isTablet') {
      collapse = true;
    } else {
      collapse = this.state.collapse;
    }

    const handler = {
      match: () => {
        this.setState({
          isScreen: type,
          collapse,
        });
      },
      unmatch: () => {
        // handler unmatched
      },
    };

    return handler;
  };

  /**
   * 左侧菜单收缩切换
   */
  toggleCollapse = () => {
    const { collapse } = this.state;
    const openKeys = !collapse ? [] : this.openKeysCache;

    this.setState({
      collapse: !collapse,
      openKeys,
    });
  };

  /**
   * 响应式通过抽屉形式切换菜单
   */
  toggleMenu = () => {
    const { openDrawer } = this.state;
    this.setState({
      openDrawer: !openDrawer,
    });
  };

  /**
   * 当前展开的菜单项
   */
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
    this.openKeysCache = openKeys;
  };

  /**
   * 响应式时点击菜单进行切换
   */
  onMenuClick = () => {
    this.toggleMenu();
  };

  /**
   * 获取当前展开的菜单项
   */
  getOpenKeys = () => {
    const { routes } = this.props;
    const matched = routes[0].path;
    let openKeys = [];

    asideNavs &&
      asideNavs.length > 0 &&
      asideNavs.map((item, index) => {
        if (item.to === matched) {
          openKeys = [`${index}`];
        }
      });

    return openKeys;
  };

  render() {
    let newAry = this.props.user.authority ? this.props.user.authority : [];
    let newlist = [];

    newAry.map((v,i) => {
      newlist.push(v);
    })

    let asideNavsList;
    if(newlist.length > 0){
      asideNavsList = this.authority(newlist);
    }


    const { location = {} } = this.props;
    const { pathname } = location;

    return (
      <Layout
        style={{ minHeight: '100vh' }}
        className={cx(
          `ice-design-header-aside-footer-responsive-layout-${theme}`,
          {
            'ice-design-layout': true,
          }
        )}
      >
        <Header
          theme={theme}
          isMobile={this.state.isScreen !== 'isDesktop' ? true : undefined}
        />
        <Layout.Section>
          {this.state.isScreen === 'isMobile' && (
            <a className="menu-btn" onClick={this.toggleMenu}>
              <Icon type="category" size="small" />
            </a>
          )}
          {this.state.openDrawer && (
            <div className="open-drawer-bg" onClick={this.toggleMenu} />
          )}
          <Layout.Aside
            width="auto"
            theme={theme}
            className={cx('ice-design-layout-aside', {
              'open-drawer': this.state.openDrawer,
            })}
          >
            {/* 侧边菜单项 begin */}
            {this.state.isScreen !== 'isMobile' && (
              <a className="collapse-btn" onClick={this.toggleCollapse}>
                <Icon
                  type={this.state.collapse ? 'arrow-right' : 'arrow-left'}
                  size="small"
                />
              </a>
            )}
            {this.state.isScreen === 'isMobile' && <Logo />}
            <Menu
              style={{ width: this.state.collapse ? 60 : 200 }}
              inlineCollapsed={this.state.collapse}
              mode="inline"
              selectedKeys={[pathname]}
              openKeys={this.state.openKeys}
              defaultSelectedKeys={[pathname]}
              onOpenChange={this.onOpenChange}
              onClick={this.onMenuClick}
            >
              {asideNavs &&
                asideNavs.length > 0 &&
                asideNavs.map((nav, index) => {
                  if (nav.children && nav.children.length > 0 && nav.status == true) {
                    return (
                      <SubMenu
                        key={index}
                        title={
                          <span>
                            {nav.icon ? (
                              <FoundationSymbol size="small" type={nav.icon} />
                            ) : null}
                            <span className="ice-menu-collapse-hide">
                              {nav.text}
                            </span>
                          </span>
                        }
                      >
                        {nav.children.map((item) => {
                            const linkProps = {};
                            if (item.newWindow) {
                              linkProps.href = item.to;
                              linkProps.target = '_blank';
                            } else if (item.external) {
                              linkProps.href = item.to;
                            } else {
                              linkProps.to = item.to;
                            }
                            return (
                                <MenuItem key={item.to}>
                                  <Link {...linkProps}>{item.text}</Link>
                                </MenuItem>
                            );
                        })}
                      </SubMenu>
                    );
                  }else if(nav.children && nav.children.length > 0 && nav.status == 'hasChildren'){
                    return (
                      <SubMenu
                        key={index}
                        title={
                          <span>
                            {nav.icon ? (
                              <FoundationSymbol size="small" type={nav.icon} />
                            ) : null}
                            <span className="ice-menu-collapse-hide">
                              {nav.text}
                            </span>
                          </span>
                        }
                      >
                        {nav.children.map((item) => {
                            if(item.status == true){
                              const linkProps = {};
                              if (item.newWindow) {
                                linkProps.href = item.to;
                                linkProps.target = '_blank';
                              } else if (item.external) {
                                linkProps.href = item.to;
                              } else {
                                linkProps.to = item.to;
                              }
                              return (
                                  <MenuItem key={item.to}>
                                    <Link {...linkProps}>{item.text}</Link>
                                  </MenuItem>
                              );
                            }
                        })}
                      </SubMenu>
                    );
                  }
                  const linkProps = {};
                  if (nav.newWindow) {
                    linkProps.href = nav.to;
                    linkProps.target = '_blank';
                  } else if (nav.external) {
                    linkProps.href = nav.to;
                  } else {
                    linkProps.to = nav.to;
                  }
                  if(nav.status == true){
                    return (
                        <MenuItem key={nav.to}>
                          <Link {...linkProps}>
                            <span>
                              {nav.icon ? (
                                <FoundationSymbol size="small" type={nav.icon} />
                              ) : null}
                              <span className="ice-menu-collapse-hide">
                                {nav.text}
                              </span>
                            </span>
                          </Link>
                        </MenuItem>
                    );
                  }
                })}
            </Menu>
            {/* 侧边菜单项 end */}
          </Layout.Aside>
          {/* 主体内容 */}
          <Layout.Main>{this.props.children}</Layout.Main>
        </Layout.Section>
        <Footer />
      </Layout>
    );
  }
}
