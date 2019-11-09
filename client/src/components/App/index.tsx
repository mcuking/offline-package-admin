import React from 'react';
import { Layout, Icon, Breadcrumb } from 'antd';
import { Switch, Route, Redirect, Link, useLocation } from 'react-router-dom';
import SideBar from '../Sidebar';
import TableList from '../TableList';
import Setting from '../Setting';

import * as styles from './index.less';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const breadcrumbNameMap: AnyObject = {
    '/list': '离线包列表',
    '/setting': '全局设置'
  };

  const location = useLocation();

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key='home'>
      <Link to='/'>首页</Link>
    </Breadcrumb.Item>
  ].concat(extraBreadcrumbItems);

  return (
    <div className={styles.app}>
      <Layout>
        <Sider width='256' trigger={null} collapsible collapsed={collapsed}>
          <div className='logo' />
          <SideBar />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.headerTrigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={toggle}
            />
          </Header>
          <Breadcrumb
            style={{
              margin: '24px 0 0 24px'
            }}>
            {breadcrumbItems}
          </Breadcrumb>
          <Content
            style={{
              margin: '24px',
              padding: 24,
              background: '#fff',
              minHeight: 280
            }}>
            <Switch>
              <Route exact path='/'>
                <Redirect to='/list' />
              </Route>
              <Route path='/list'>
                <TableList />
              </Route>
              <Route path='/setting'>
                <Setting />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
