import React from 'react';
import Select, { SingleValue } from 'react-select';
import { TaskType, taskType } from '@/util/ZodTypes';

interface TaskTypeOption {
    value: TaskType;
    label: string;
}

interface TaskTypeDropdownProps {
    onTypeSelect: (type: TaskType) => void;
    currentType?: TaskType;
}

const TaskTypeDropdown: React.FC<TaskTypeDropdownProps> = ({
    onTypeSelect,
    currentType
}) => {
    const typeOptions: TaskTypeOption[] = taskType.options.map(type => ({
        value: type,
        label: type
    }));

    return (
        <Select<TaskTypeOption>
            options={typeOptions}
            value={typeOptions.find(option => option.value === currentType)}
            onChange={(option: SingleValue<TaskTypeOption>) => {
                if (option) {
                    onTypeSelect(option.value);
                }
            }}
            placeholder="Select type"
            className="w-full"
        />
    );
};

export default TaskTypeDropdown;