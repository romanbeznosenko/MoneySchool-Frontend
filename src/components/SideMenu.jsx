import { Layout, Card, Typography, Avatar, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    TeamOutlined,
    FolderOutlined,
    WalletOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Sider } = Layout;
const { Title, Text } = Typography;

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
        },
    }),
};

export default function SideMenu({ user, selectedMenu, setSelectedMenu }) {
    const navigate = useNavigate();

    return (
        <Sider
            width={240}
            style={{
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '100vh',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Title Section */}
            <div style={{ padding: '24px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                    SchoolMoney
                </Title>
            </div>

            {/* Menu — allow scrolling if it grows. Add bottom padding so it doesn't get hidden
                behind the absolutely positioned profile card. */}
            <div style={{ padding: '16px 0', paddingBottom: 120, flex: 1, overflowY: 'auto' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedMenu]}
                    onClick={({ key }) => {
                        setSelectedMenu(key);
                        // navigate to respective route for main items
                        switch (key) {
                            case 'dashboard':
                                navigate('/dashboard');
                                break;
                            case 'students':
                                navigate('/students');
                                break;
                            case 'collections':
                                navigate('/collections');
                                break;
                            case 'finance':
                                navigate('/finance');
                                break;
                            case 'messages':
                                navigate('/messages');
                                break;
                            default:
                                break;
                        }
                    }}
                    style={{ border: 'none' }}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: 'students',
                            icon: <TeamOutlined />,
                            label: 'My Students',
                        },
                        {
                            key: 'collections',
                            icon: <FolderOutlined />,
                            label: 'Collections',
                        },
                        {
                            key: 'finance',
                            icon: <WalletOutlined />,
                            label: 'Finance Account',
                        },
                        {
                            key: 'messages',
                            icon: <MessageOutlined />,
                            label: 'Messages',
                        },
                    ]}
                />
            </div>

            {/* Profile Card at bottom (absolute pinned) */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, flexShrink: 0 }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    custom={0}
                >
                    <Card
                        style={{
                            margin: 16,
                            borderRadius: 25,
                            // subtle elevation to match dashboard cards
                            boxShadow: '0 6px 12px rgba(15, 15, 15, 0.04)',
                        }}
                        bordered={false}
                        onClick={() => navigate('/profile')}
                        hoverable
                        bodyStyle={{ padding: 12, cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar
                                size={48}
                                // avoid passing empty string to `src` (causes React warning)
                                src={user?.avatar || null}
                                style={{ flexShrink: 0 }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        fontSize: 15,
                                        fontWeight: 700,
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{user?.name || 'User'}</div>
                                    <div style={{
                                        fontSize: 12,
                                        color: '#6b6b6b',
                                        marginTop: 4,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{user?.email || 'No email'}</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </Sider>
    );
}
