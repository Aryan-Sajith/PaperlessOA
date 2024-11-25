"use client";
import "./workflow_card.css"
import Link from "next/link";

const CreateWorkflow = () => {
    return(
        <main className="content">
            <div className="card-container">
                <Link href="/workflows/onboarding" >
                    <div className="card">Onboarding: Add new Employees</div>
                </Link>
                <Link href={"/workflows/promotion"}>
                    <div className="card">Promotion: Promote to a higher position</div>
                </Link>
                <Link href={"/workflows/resignation"}>
                    <div className="card">Resignation: Resign for the job</div>
                </Link>
                <Link href={"/workflows/absence"}>
                    <div className="card">Absence: Leave for work</div>
                </Link>
            </div>
        </main>
    );
}

export default CreateWorkflow;