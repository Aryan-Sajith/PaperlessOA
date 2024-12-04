import { Task } from "@/app/tasks/page";

export const sortTasks = (tasks: Task[]) => {
    if (!tasks.length) { // If no tasks exist, return an empty array
        return [];
    }

    return tasks.sort((a, b) => {
        // If a is completed and b is not, a should come after b
        if (a.status === "Completed" && b.status !== "Completed") {
            return 1;
        }
        // If a is not completed and b is, a should come before b
        else if (a.status !== "Completed" && b.status === "Completed") {
            return -1;
        } else { // If both are completed or not completed, sort arbitrarily
            return 0;
        }
    });
}