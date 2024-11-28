import React from 'react';
import Select, { SingleValue } from 'react-select';
import { TaskStatus, taskStatus } from '@/util/ZodTypes';

interface TaskStatusOption {
    value: TaskStatus;
    label: string;
}

interface TaskStatusDropdownProps {
    onStatusSelect: (status: TaskStatus) => void;
    currentStatus?: TaskStatus;
}

const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({ 
    onStatusSelect,
    currentStatus 
}) => {
    const statusOptions: TaskStatusOption[] = taskStatus.options.map(status => ({
        value: status,
        label: status
    }));

    return (
        <Select<TaskStatusOption>
            options={statusOptions}
            value={statusOptions.find(option => option.value === currentStatus)}
            onChange={(option: SingleValue<TaskStatusOption>) => {
                if (option) {
                    onStatusSelect(option.value);
                }
            }}
            placeholder="Select status"
            className="w-full"
        />
    );
};

export default TaskStatusDropdown;