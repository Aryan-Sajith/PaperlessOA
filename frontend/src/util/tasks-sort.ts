import { Task } from '../app/tasks/page';

export const sortTasks = (tasks: Task[]) => {
    /* 
    -1 -> Left item comes first
    1 -> Right item comes first
    0 -> Order arbitrarily
    */

    return tasks.sort((a: Task, b: Task) => {
        // First order sort by assignnee_id
        if (a.assignee_id !== b.assignee_id) {
            return a.assignee_id - b.assignee_id; // Groups tasks by assignee_id
        }

        // Second order sort by status
        if (a.status !== b.status) {
            return a.status === "In Progress" ? -1 : 1;
        }

        // Third order sort by due date
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
};