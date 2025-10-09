import { classService } from '../services/classService';

export const createClassHandlers = (
    setClasses,
    setClassesLoading,
    setSelectedClass,
    classesTab
) => {
    const handleClassClick = (classItem) => {
        console.log('Class clicked:', classItem);
        setSelectedClass({
            id: classItem.id,
            name: classItem.name,
            memberCount: classItem.memberCount || 0,
            treasurer: classItem.treasurer,
            isTreasurer: classItem.isTreasurer,
        });
    };

    const handleClassAdded = async () => {
        try {
            setClassesLoading(true);
            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);
        } catch (err) {
            console.error('Failed to refresh classes:', err);
        } finally {
            setClassesLoading(false);
        }
    };

    const handleClassEdit = async (classId, updates) => {
        try {
            await classService.updateClass(classId, updates);

            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);

            const updatedClass = response.classes.find(c => c.id === classId);
            if (updatedClass) {
                setSelectedClass({
                    id: updatedClass.id,
                    name: updatedClass.name,
                    memberCount: updatedClass.memberCount || 0,
                    treasurer: updatedClass.treasurer,
                    isTreasurer: updatedClass.isTreasurer,
                });
            }

            console.log('Class updated successfully');
        } catch (err) {
            console.error('Failed to update class:', err);
            alert(`Failed to update class: ${err.message}`);
        }
    };

    const handleClassDelete = async (classId) => {
        try {
            await classService.deleteClass(classId);

            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);

            console.log('Class deleted successfully');
        } catch (err) {
            console.error('Failed to delete class:', err);
            alert(`Failed to delete class: ${err.message}`);
        }
    };

    return {
        handleClassClick,
        handleClassAdded,
        handleClassEdit,
        handleClassDelete,
    };
};