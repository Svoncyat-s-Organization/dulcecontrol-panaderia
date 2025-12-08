import { Layout, Menu, Breadcrumb, Dropdown, Avatar, Space, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { IconChevronDown } from '@tabler/icons-react';
import { useMenuLogic } from '../../shared/hooks/useMenuLogic.jsx';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = ({
  basePath,
  menuItems,
  headerTitle,
  brandLabel,
  brandCollapsedLabel = 'DC',
  headerExtras = null,
  profileMenu,
  profileName,
  profileInitials,
  footerText,
  layoutStyle = {},
  innerLayoutStyle = {},
  headerStyle = {},
  siderStyle = {},
  brandStyle = {},
  contentStyle = {},
  contentCardStyle = {},
  avatarStyle = {},
}) => {
  const { token: themeToken } = theme.useToken();
  const { collapsed, setCollapsed, menuKey, menuProps, breadcrumbItems } = useMenuLogic(
    menuItems,
    basePath
  );
  const sidebarWidth = siderStyle?.width ?? 264;
  const collapsedSidebarWidth = siderStyle?.collapsedWidth ?? 80;
  const headerHeight = headerStyle?.height ?? 64;

  const combinedLayoutStyle = {
    minHeight: '100vh',
    ...layoutStyle,
  };

  const combinedInnerLayoutStyle = {
    ...innerLayoutStyle,
  };

  const combinedSiderStyle = {
    background: '#fff',
    borderRight: `1px solid ${themeToken.colorBorderSecondary}`,
    ...siderStyle,
  };

  const combinedBrandStyle = {
    height: headerHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    letterSpacing: 0.5,
    fontWeight: 600,
    backgroundColor: themeToken.colorPrimary,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
    ...brandStyle,
  };

  const combinedHeaderStyle = {
    height: headerHeight,
    padding: '0 16px',
    background: themeToken.colorBgElevated,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `2px solid ${themeToken.colorPrimary}`,
    ...headerStyle,
  };

  const combinedContentStyle = {
    margin: '24px',
    padding: 0,
    minHeight: 'calc(100vh - 160px)',
    background: themeToken.colorBgLayout,
    ...contentStyle,
  };

  const combinedContentCardStyle = {
    padding: '0px 32px',
    ...contentCardStyle,
  };

  const combinedAvatarStyle = {
    backgroundColor: themeToken.colorPrimary,
    color: '#fff',
    ...avatarStyle,
  };

  const shouldRenderActions = headerExtras || profileMenu;

  return (
    <Layout style={combinedLayoutStyle}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={sidebarWidth}
        collapsedWidth={collapsedSidebarWidth}
        style={combinedSiderStyle}
      >
        <div style={combinedBrandStyle}>{collapsed ? brandCollapsedLabel : brandLabel}</div>
        <Menu key={menuKey} theme="light" mode="inline" {...menuProps} />
      </Sider>
      <Layout style={combinedInnerLayoutStyle}>
        <Header style={combinedHeaderStyle}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{headerTitle}</div>
          {shouldRenderActions && (
            <Space size={16} align="center">
              {headerExtras}
              {profileMenu && (
                <Dropdown menu={profileMenu} trigger={['click']}>
                  <Space size={10} style={{ cursor: 'pointer' }}>
                    <Avatar style={combinedAvatarStyle}>{profileInitials}</Avatar>
                    <span style={{ fontWeight: 500 }}>{profileName}</span>
                    <IconChevronDown size={16} />
                  </Space>
                </Dropdown>
              )}
            </Space>
          )}
        </Header>
        <Content style={combinedContentStyle}>
          <div style={{ padding: '0 32px 16px' }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div style={combinedContentCardStyle}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{footerText}</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
