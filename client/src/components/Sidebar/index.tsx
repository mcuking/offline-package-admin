import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Icon } from 'antd';

import * as styles from './index.less';

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <div className={styles.menu_sider}>
      <div className={styles.menu_logo}>
        <span>离线包管理平台</span>
      </div>
      <Menu
        style={{ height: '100%' }}
        defaultSelectedKeys={['/list']}
        selectedKeys={[location.pathname]}
        theme='dark'
        mode='inline'>
        <Menu.Item key='/list'>
          <Link to='/list'>
            <Icon type='ordered-list' />
            <span>离线包列表</span>
          </Link>
        </Menu.Item>
        <Menu.Item key='/setting'>
          <Link to='/setting'>
            <Icon type='setting' />
            <span>全局设置</span>
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
