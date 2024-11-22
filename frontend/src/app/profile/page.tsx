import  EmployeeBox  from "../../components/EmployeeBox"
import TaskList from "@/components/TaskList";
interface Employee {
    id: number;
    name: string;
    role: string;
    photoUrl: string;
    subordinates?: Employee[];
}

type Task = {
    id: string;
    title: string;
    status: string;
    due_date: string;
    description: string;
    type: string;
    assignee: string;
  }

interface ProfileProps {
    employee: Employee;
    tasks: Task[];
}

const tasks: Task[] = [
    { id: "1", title: "Task 1", due_date: "2024-11-15", description: "Details about Task 1", assignee: "Aryan", status: "incomplete", type: "High priority" },
    { id: "2", title: "Task 2", due_date: "2024-11-16", description: "Details about Task 2", assignee: "William", status: "complete", type: "Low priority" },
  ];

const employee = {
    id: 1,
    name: "John Doe",
    role: "Team Lead",
    photoUrl: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
    subordinates: [
        { id: 2, name: "Jane Smith", role: "Developer", photoUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR6eHoxPGX4cPrRuRJZQ3JxsiApNSDSiRUJYiBv5N3cT4yxfwqf8LfDtuUX69867yCQLW0qvXPJdOfsYIq9A9mdO3Nhj6ulwtIVyZY-EhI" },
        { id: 3, name: "Joe boden", role: "Designer", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/1200px-Joe_Biden_presidential_portrait.jpg" },
    ],
};


export default function profile(){
    return(
<div className="w-full h-screen p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
<div className="flex flex-row space-x-4 justify-center items-center">
{/* Circular Photo */}
<img 
src={employee.photoUrl} 
alt={`${employee.name}'s photo`} 
className="w-24 h-24 rounded-full mb-4"
/>

<div>
 {/* Name and Role */}
 <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {employee.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {employee.role}
                </p>   
</div>
</div>
<hr className="border-t-4 border-gray-400 my-4"/>

<div className="flex flex-row space-x-20 justify-center">
    <div className="flex flex-row space-x-4 justify-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white"> 
        Assigned Tasks</h2>
        

    </div>
    <div/>
    <div/>
    <div className="flex flex-row space-x-4 justify-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white space-y-2">
            Subordinates
        </h2>
        <div className="mt-2 space-y-4">
                        {employee.subordinates.map((sub) => (
                            <EmployeeBox key={sub.id} employee={sub} />
                        ))}
                    </div>
    </div>
</div>

</div>
    )
}