import { Layout, Card, Typography, Avatar, Menu } from 'antd';
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
    return (
        <Sider
            width="10%"
            style={{
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Title Section */}
            <div style={{ padding: '24px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                    SchoolMoney
                </Title>
            </div>

            <div style={{ padding: '16px 0', flex: 1 }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedMenu]}
                    onClick={({ key }) => setSelectedMenu(key)}
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

            {/* Profile Card at bottom */}
            <div style={{ marginTop: 'auto' }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    custom={0}
                >
                    <Card
                        style={{
                            margin: 16,
                            borderRadius: 8,
                        }}
                        bordered={false}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar
                                size={40}
                                src={user?.avatar || ""}
                                style={{ flexShrink: 0 }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Title
                                    level={5}
                                    style={{
                                        margin: 0,
                                        marginBottom: 4,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {user?.name || 'User'}
                                </Title>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12,
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {user?.email || 'No email'}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </Sider>
    );
}
