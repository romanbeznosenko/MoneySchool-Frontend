import { useState, useEffect, useCallback, useMemo } from 'react';
import { classService } from '../services/classService'

export const useClasses = (user, classesTab) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);

    const fetchClasses = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const isTreasurer = classesTab === 1;
            const response = await classService.getUserClasses(1, 10, isTreasurer);
            setClasses(response.classes);
        } catch (err) {
            console.error('Failed to fetch classes:', err);
        } finally {
            setLoading(false);
        }
    }, [user, classesTab]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const treasurerClassesCount = useMemo(() => {
        return classes.filter(c => c.isTreasurer).length;
    }, [classes]);

    const handleClassClick = useCallback((classItem) => {
        console.log('Class clicked:', classItem);
        setSelectedClass({
            id: classItem.id,
            name: classItem.name,
            memberCount: classItem.memberCount || 0,
            treasurer: classItem.treasurer,
            isTreasurer: classItem.isTreasurer,
        });
    }, []);

    const handleClassAdded = useCallback(async () => {
        await fetchClasses();
    }, [fetchClasses]);

    const handleClassEdit = useCallback(async (classId, updates) => {
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
    }, [classesTab]);

    const handleClassDelete = useCallback(async (classId) => {
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
    }, [classesTab]);

    return {
        classes,
        loading,
        selectedClass,
        setSelectedClass,
        treasurerClassesCount,
        handleClassClick,
        handleClassAdded,
        handleClassEdit,
        handleClassDelete,
    };
};