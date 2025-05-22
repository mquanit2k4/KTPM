import React, { useState } from 'react';
import { Flex, Button, Layout, Menu } from 'antd';
import { FaLeaf } from 'react-icons/fa';
import './SideBar.css';
import {
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  FormOutlined,
  NotificationOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  DollarCircleTwoTone,
  HistoryOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';

import Sider from 'antd/es/layout/Sider';
import { Link } from 'react-router-dom';

interface SideBarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <Sider
      theme="dark"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="sider"
    >
      <>
        <Flex align="center" justify="center">
          <div className="logo">
            <img src="/assets/icons/logo.png" alt="Logo" style={{ width: 150, height: 40, objectFit: 'contain' }} />
          </div>
        </Flex>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          className="menu-bar"
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/home">Trang chủ</Link>
          </Menu.Item>
          {/* <Menu.Item key="2" icon={<UserOutlined />}>
            Tài khoản
          </Menu.Item> */}
          <Menu.Item key="3" icon={<BarChartOutlined />}>
            <Link to="/dashboard">Thống kê</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<MoneyCollectOutlined twoToneColor="#ef5455" />}>
            <Link to="/transferfeepage">Phí bắt buộc</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<MoneyCollectOutlined twoToneColor="#ef5455" />}>
            <Link to="/transfercontributefeepage">Phí tự nguyện</Link>
          </Menu.Item>
          {/* <Menu.Item key="6" icon={<FormOutlined />}>
            Báo cáo
          </Menu.Item>
          <Menu.Item key="7" icon={<NotificationOutlined />}>
            Thông báo
          </Menu.Item> */}
          {/* <Menu.SubMenu key="6" icon={<DollarCircleOutlined />} title="Khoản thu">
            <Menu.Item key="7">
              <Link to="/feepage">Bắt buộc</Link>
            </Menu.Item>

            <Menu.Item key="8">
              <Link to="/contribute">Đóng góp</Link>
            </Menu.Item>
          </Menu.SubMenu>*/}
          <Menu.Item key="9" icon={<DollarCircleOutlined />}>
            <Link to="/receivable-fee">Khoản thu</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<HistoryOutlined />}>
            <Link to="/history">Lịch sử</Link>
          </Menu.Item>
        </Menu>
      </>

      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="triger-btn"
      />
    </Sider>
  );
};

export default SideBar;
