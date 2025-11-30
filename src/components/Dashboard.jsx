import { useState } from 'react';
import {
    Layout,
    Card,
    Typography,
    Button,
    Row,
    Col,
    Tabs,
    Tag,
    Spin,
    Space,
} from 'antd';
import {
    LogoutOutlined,
    PlusOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import StudentCard, { getInitialsFromName } from './student/StudentCard';
import AddStudentDialog from './student/AddStudentDialog';
import StudentDetailsDialog from './student/StudentDetailsDialog';
import ClassCard from './class/ClassCard';
import AddClassDialog from './class/AddClassDialog';
import JoinClassDialog from './class/JoinClassDialog';
import ClassDetailsDialog from './class/ClassDetailsDialog';
import DashboardSider from './SideMenu';
import { useUser } from './../hooks/useUser';
import { useStudents } from './../hooks/useStudents';
import { useClasses } from './../hooks/useClasses';

const { Header, Content, Footer } = Layout;
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

export default function Dashboard({ onLogout }) {
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
    const [classesTab, setClassesTab] = useState('all');
    const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
    const [addClassDialogOpen, setAddClassDialogOpen] = useState(false);
    const [joinClassDialogOpen, setJoinClassDialogOpen] = useState(false);
    const [studentDetailsDialogOpen, setStudentDetailsDialogOpen] = useState(false);
    const [classDetailsDialogOpen, setClassDetailsDialogOpen] = useState(false);

    const { user, loading, error } = useUser();

    const {
        students,
        loading: studentsLoading,
        selectedStudent,
        setSelectedStudent,
        handleStudentClick: handleStudentClickBase,
        handleStudentAdded,
        handleStudentEdit,
        handleStudentDelete,
    } = useStudents(user);

    const {
        classes,
        loading: classesLoading,
        selectedClass,
        setSelectedClass,
        treasurerClassesCount,
        handleClassClick: handleClassClickBase,
        handleClassAdded,
        handleClassEdit,
        handleClassDelete,
    } = useClasses(user, classesTab === 'all' ? 0 : 1);

    const handleStudentClick = (student) => {
        handleStudentClickBase(student);
        setStudentDetailsDialogOpen(true);
    };

    const handleClassClick = (classItem) => {
        handleClassClickBase(classItem);
        setClassDetailsDialogOpen(true);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error && !user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '24px'
            }}>
                <Text type="danger">Failed to load user data: {error}</Text>
            </div>
        );
    }

    const tabItems = [
        {
            key: 'all',
            label: 'All Classes',
            children: null,
        },
        {
            key: 'treasurer',
            label: (
                <Space>
                    <span>My Treasurer Classes</span>
                    <Tag>{classesTab === 'treasurer' ? classes.length : treasurerClassesCount}</Tag>
                </Space>
            ),
            children: null,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardSider
                user={user}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
            />

            <Layout style={{ marginLeft: 240 }}>
                <Header
                    style={{
                        background: '#fff',
                        padding: '0 24px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Dashboard
                    </Title>
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={onLogout}
                        style={{
                            borderColor: '#d9d9d9',
                        }}
                    >
                        Logout
                    </Button>
                </Header>

                <Content style={{ padding: '24px', background: '#fafafa', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '70%' }}>
                        <Row gutter={[0, 24]}>
                            <Col span={24}>
                                <Text
                                    style={{ fontSize: 24, fontWeight: 800 }}>
                                    Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                                </Text>
                                <Text
                                    style={{ display: 'block', fontSize: 18, color: '#555', marginTop: 4 }}>
                                    Manage your children's finances the easy way
                                </Text>
                            </Col>
                            <Col span={8}>
                                <Card
                                    style={{
                                        borderRadius: 25,
                                        textAlign: 'center',
                                        marginRight: 16,
                                    }}
                                >
                                    <Title level={4} style={{ margin: 0, textAlign: 'left', marginBottom: 8 }}>
                                        My Students
                                    </Title>
                                    <Text type="primary" style={{ textAlign: "left", display: "block" }}>
                                        {students.length} {students.length === 1 ? 'student' : 'students'}
                                    </Text>
                                    <Text type="primary" style={{ textAlign: 'left', display: 'block' }}>
                                        Manage Your Students
                                    </Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    style={{
                                        borderRadius: 25,
                                        textAlign: 'center',
                                        marginRight: 16,
                                    }}
                                >
                                    <Title level={4} style={{ margin: 0, textAlign: 'left', marginBottom: 8 }}>
                                        Active Collections
                                    </Title>
                                    <Text type="primary" style={{ textAlign: "left", display: "block" }}>
                                        In development
                                    </Text>
                                    <Text type="primary" style={{ textAlign: 'left', display: 'block' }}>
                                        View all
                                    </Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    style={{
                                        borderRadius: 25,
                                        textAlign: 'center',
                                        marginRight: 16,
                                    }}
                                >
                                    <Title level={4} style={{ margin: 0, textAlign: 'left', marginBottom: 8 }}>
                                        Account Balance
                                    </Title>
                                    <Text type="primary" style={{ textAlign: "left", display: "block" }}>
                                        In development
                                    </Text>
                                    <Text type="primary" style={{ textAlign: 'left', display: 'block' }}>
                                        Manage Your Account
                                    </Text>
                                </Card>
                            </Col>
                            {/* Students Section */}
                            <Col span={24}>
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                    custom={1}
                                >
                                    <Card
                                        title={
                                            <div>
                                                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                                                    My Students
                                                </Title>
                                                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                                                    List of children assigned to your account
                                                </Text>
                                            </div>
                                        }
                                        extra={
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={() => setAddStudentDialogOpen(true)}
                                                style={{
                                                    background: '#000',
                                                    borderColor: '#000',
                                                }}
                                            >
                                                Add Student
                                            </Button>
                                        }
                                        style={{
                                            borderRadius: 25,
                                            paddingTop: 16,
                                        }}
                                    >
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            {studentsLoading ? (
                                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                                    <Spin />
                                                </div>
                                            ) : students.length === 0 ? (
                                                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '32px 0' }}>
                                                    No students found. Add your first student!
                                                </Text>
                                            ) : (
                                                students.map((student, index) => (
                                                    <motion.div
                                                        key={student.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 + index * 0.1 }}
                                                    >
                                                        <StudentCard
                                                            student={{
                                                                id: student.id,
                                                                name: student.fullName,
                                                                age: student.age,
                                                                avatar: student.avatar,
                                                            }}
                                                            getInitials={getInitialsFromName}
                                                            onClick={() => handleStudentClick(student)}
                                                        />
                                                    </motion.div>
                                                ))
                                            )}
                                        </Space>
                                    </Card>
                                </motion.div>
                            </Col>

                            {/* Classes Section */}
                            <Col span={24}>
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                    custom={2}
                                >
                                    <Card
                                        title={
                                            <div>
                                                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                                                    My Classes
                                                </Title>
                                                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                                                    View and manage your classes
                                                </Text>
                                            </div>
                                        }
                                        extra={
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => setAddClassDialogOpen(true)}
                                                    style={{
                                                        background: '#000',
                                                        borderColor: '#000',
                                                    }}
                                                >
                                                    Create Class
                                                </Button>
                                                <Button
                                                    icon={<UserAddOutlined />}
                                                    onClick={() => setJoinClassDialogOpen(true)}
                                                >
                                                    Join Class
                                                </Button>
                                            </Space>
                                        }
                                        style={{
                                            borderRadius: 25,
                                            paddingTop: 16,
                                        }}
                                    >
                                        <Tabs
                                            activeKey={classesTab}
                                            onChange={(key) => setClassesTab(key)}
                                            items={tabItems}
                                            style={{ marginBottom: 16 }}
                                        />

                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            {classesLoading ? (
                                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                                    <Spin />
                                                </div>
                                            ) : classes.length === 0 ? (
                                                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '32px 0' }}>
                                                    {classesTab === 'all'
                                                        ? 'No classes found. Create your first class!'
                                                        : 'You are not a treasurer of any classes yet.'}
                                                </Text>
                                            ) : (
                                                classes.map((classItem, index) => (
                                                    <motion.div
                                                        key={classItem.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 + index * 0.1 }}
                                                    >
                                                        <ClassCard
                                                            classItem={classItem}
                                                            onClick={() => handleClassClick(classItem)}
                                                        />
                                                    </motion.div>
                                                ))
                                            )}
                                        </Space>
                                    </Card>
                                </motion.div>
                            </Col>

                            {/* Transaction History Section */}
                            <Col span={24}>
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                    custom={2}
                                >
                                    <Card
                                        title={
                                            <div>
                                                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                                                    Last of transactions
                                                </Title>
                                                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                                                    Your deposit and withdrawal history
                                                </Text>
                                            </div>
                                        }
                                        style={{
                                            borderRadius: 25,
                                            paddingTop: 16,
                                        }}
                                    >

                                        <Text type="primary" style={{ display: 'block', textAlign: 'center', padding: '32px 0' }}>
                                            In development
                                        </Text>
                                    </Card>
                                </motion.div>
                            </Col>
                        </Row>
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                    School Money ©{new Date().getFullYear()}
                </Footer>
            </Layout>

            {/* Dialogs */}
            <AddStudentDialog
                open={addStudentDialogOpen}
                onClose={() => setAddStudentDialogOpen(false)}
                onStudentAdded={handleStudentAdded}
            />

            <StudentDetailsDialog
                student={selectedStudent}
                open={studentDetailsDialogOpen}
                onClose={() => setStudentDetailsDialogOpen(false)}
                getInitials={getInitialsFromName}
                onEdit={handleStudentEdit}
                onDelete={handleStudentDelete}
            />

            <AddClassDialog
                open={addClassDialogOpen}
                onClose={() => setAddClassDialogOpen(false)}
                onClassAdded={handleClassAdded}
            />

            <JoinClassDialog
                open={joinClassDialogOpen}
                onClose={() => setJoinClassDialogOpen(false)}
                onClassJoined={handleClassAdded}
                students={students}
            />

            <ClassDetailsDialog
                classItem={selectedClass}
                open={classDetailsDialogOpen}
                onClose={() => setClassDetailsDialogOpen(false)}
                onEdit={handleClassEdit}
                onDelete={handleClassDelete}
            />
        </Layout>
    );
}
