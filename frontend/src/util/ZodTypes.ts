import { z } from 'zod'

const employee = z.object({
    employee_id: z.number(),
    position: z.string(),
    is_manager: z.boolean(),
    start_date: z.date(),
    status: z.string(),
    birth_date: z.date(),
    name: z.string(),
    salary: z.number(),
    level: z.string()
})

export type Employee = z.infer<typeof employee>

export const taskStatus = z.enum([
    "In Progress",
    "Completed"
])

export type TaskStatus = z.infer<typeof taskStatus>;