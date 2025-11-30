import { useState } from 'react';
import { Layout, Card, Button, Row, Col, Spin, Typography } from 'antd';
import DashboardSider from './SideMenu';
import { useUser } from '../hooks/useUser';
import { useStudents } from '../hooks/useStudents';
import StudentCard, { getInitialsFromName } from './student/StudentCard';
import AddStudentDialog from './student/AddStudentDialog';

const { Content } = Layout;

export default function StudentsPage() {
    const { user, loading: userLoading } = useUser();
    const { students, loading, handleStudentClick, handleStudentAdded } = useStudents(user);
    const [addOpen, setAddOpen] = useState(false);

    if (userLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin /></div>;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardSider user={user} selectedMenu={'students'} setSelectedMenu={() => {}} />
            <Layout>
                <Content style={{ padding: 24, background: '#fafafa' }}>
                    <div style={{ maxWidth: 900, margin: '0 auto' }}>
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
