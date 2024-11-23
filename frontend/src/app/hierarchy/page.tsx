// This is the /hierarchy page

import React from 'react'
import EmployeeBox from "../../components/EmployeeBox";

const employees = {
    id: 1,
    name: "John Doe",
    role: "Team Lead",
    photoUrl: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
    subordinates: [
        { id: 2, name: "Jane Smith", role: "Developer", photoUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR6eHoxPGX4cPrRuRJZQ3JxsiApNSDSiRUJYiBv5N3cT4yxfwqf8LfDtuUX69867yCQLW0qvXPJdOfsYIq9A9mdO3Nhj6ulwtIVyZY-EhI" },
        { id: 3, name: "Joe boden", role: "Designer", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/1200px-Joe_Biden_presidential_portrait.jpg" },
    ],
};

export default function hierarchy() {
  return (
    <div className="p-6">
        <EmployeeBox employee={employees} />
    </div>
);
}
