import { Task } from '../app/tasks/page';

export const sortTasks = (tasks: Task[]) => {
    /* 
    -1 -> Left item comes first
    1 -> Right item comes first
    0 -> Order arbitrarily
    */

    return tasks.sort((a: Task, b: Task) => {
        // First order sort by completion status
        if (a.status === "In Progress" && b.status == "Completed") {
            return -1;
        } else if (a.status === "Completed" && b.status === "In Progress") {
            return 1;
        } else {
            // Second order sort by due date
            if (a.due_date < b.due_date) {
                return -1;
            } else if (a.due_date > b.due_date) {
                return 1;
            } else {
                return 0; // If due dates are equal, order arbitrarily
            }
        }
    });
};