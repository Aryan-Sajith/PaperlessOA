// This is the root page of the app.


import Link from 'next/link'
import EmployeeDropdown from '../components/EmployeeDropDown';


export default function HomePage() {


  return (
    <div>
      <h1>Home Page</h1>
      <p>Hierarchy page <Link href="/hierarchy" className="text-blue-400 underline">hierarchy page</Link></p>
      <p>Tasks page <Link href="/tasks" className="text-blue-400 underline">tasks page</Link></p>
        <p>Workflow page <Link href="/workflows" className="text-blue-400 underline">workflow page</Link></p>
        <p>Profile page <Link href="/profile" className="text-blue-400 underline">Profile Page</Link></p>
    </div>
  )
 

};

