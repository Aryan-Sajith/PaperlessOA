// This is the root page of the app.


import Link from 'next/link'


export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Hierarchy page <Link href="/hierarchy" className="text-blue-400 underline">hierarchy page</Link></p>
      <p>Tasks page <Link href="/tasks" className="text-blue-400 underline">tasks page</Link></p>
    </div>
  )
};

