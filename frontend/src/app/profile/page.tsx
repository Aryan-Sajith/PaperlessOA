"use client";

import React from "react";
import ProtectedRoute from "@/components/user-auth/ProtectedRoute";

export default function Profile() {
    return (<ProtectedRoute>{(user) => (<div>
        <div className="flex space-x-4 border-black border-b pb-4">
            <img src={"https://static.vecteezy.com/system/resources/previews/011/961/865/non_2x/programmer-icon-line-color-illustration-vector.jpg"} className="w-32 rounded-full border border-black" />
            <div className="flex flex-col justify-center">
                <p className="text-green-500">{user.status}</p>
                <p className="text-2xl font-bold">{user.name}</p>
                <p>{user.position}</p>
            </div>
        </div>

        <div className="mt-4">
            <h1 className="text-2xl font-bold pb-2">Employee Details</h1>
            <p data-testid="profile-salary"><span className="font-bold" >Salary:</span> ${user.salary}</p>
            <p data-testid="profile-manager"><span className="font-bold" >Manager:</span> {user.is_manager ? 'true' : 'false'}</p>
            <p data-testid="profile-start"><span className="font-bold" >Start Date:</span> {new Date(user.start_date).toLocaleDateString()}</p>
            <p data-testid="profile-DOB"><span className="font-bold" >Birth Date:</span> {new Date(user.birth_date).toLocaleDateString()}</p>
            <p data-testid="profile-level"><span className="font-bold" >Level:</span> {user.level}</p>
        </div>

    </div>)}</ProtectedRoute>)
}