import { useState } from 'react';
import { Layout, Card, Button, Row, Col, Spin, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import DashboardSider from './SideMenu';
import { useUser } from '../hooks/useUser';
import { useStudents } from '../hooks/useStudents';
import StudentCard, { getInitialsFromName } from './student/StudentCard';
import AddStudentDialog from './student/AddStudentDialog';

const { Content, Header } = Layout;
const { Title } = Typography;

export default function StudentsPage({ onLogout }) {
    const { user, loading: userLoading } = useUser();
    const { students, loading, handleStudentClick, handleStudentAdded } = useStudents(user);
    const [addOpen, setAddOpen] = useState(false);

    if (userLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin /></div>;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardSider user={user} selectedMenu={'students'} setSelectedMenu={() => { }} />
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
                        My Students
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
                <Content style={{ padding: 24, background: '#fafafa', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '70%' }}>
                        <Card style={{ borderRadius: 25, padding: 24, boxShadow: '0 6px 12px rgba(15,15,15,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Typography.Title level={4} style={{ margin: 0 }}>My Students</Typography.Title>
                                <Button type="primary" onClick={() => setAddOpen(true)} style={{ background: '#000', borderColor: '#000' }}>+ Add Student</Button>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                            ) : students.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40, color: '#777' }}>No students found. Add your first student!</div>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {students.map((s) => (
                                        <Col span={24} key={s.id}>
                                            <StudentCard
                                                student={{ id: s.id, name: s.fullName || `${s.firstName} ${s.lastName}`, age: s.age, avatar: s.avatar }}
                                                getInitials={getInitialsFromName}
                                                onClick={() => handleStudentClick(s)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Card>
                    </div>
                </Content>
            </Layout>

            <AddStudentDialog open={addOpen} onClose={() => setAddOpen(false)} onStudentAdded={async () => { setAddOpen(false); await handleStudentAdded(); }} />
        </Layout>
    );
}