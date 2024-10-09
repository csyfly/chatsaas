'use client'
import React from 'react';
import { useUser } from "@clerk/nextjs";
// export const runtime = 'edge';

const AdminPage = () => {
    const { user } = useUser();
    if (!user || user?.emailAddresses[0].emailAddress !== 'chenzhaoyi9909@gmail.com') {
        return <div>You are not authorized to access this page.</div>;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome, {user?.emailAddresses[0].emailAddress}!</p>
        </div>
    )
}

export default AdminPage;