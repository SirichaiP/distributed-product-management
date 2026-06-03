// src/app/(dashboard)/dashboard/users/page.tsx

"use client";

import { useState } from "react";
import { mockUsers } from "@/lib/mock/mockUsers";
import {  canAccess,  canWrite,} from "@/lib/permissions";

export default function UsersPage() {
  const [role] = useState<"Admin" | "User">("Admin");

  if (!canAccess(role, "canViewUsers")) {
    return <div>Permission denied</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <div className="page-breadcrumb">
            <a href="/dashboard">Home</a> <span>/</span> Admin <span>/</span> Users
          </div>
        </div>

        {canAccess(role, "canCreateUser") && (
          <button className="btn-primary">+ Add User</button>
        )}
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <input placeholder="Search users..." />
          </div>

          <select className="filter-select">
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {mockUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="user-meta">
                      <div className="user-avatar">
                        {user.name
                          .split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={
                        user.role === "Admin"
                          ? "badge badge-blue"
                          : "badge badge-purple"
                      }
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.status === "Active"
                          ? "badge badge-green"
                          : "badge badge-red"
                      }
                    >
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="action-btns">
                      { canAccess(role, "canEditUser") && (
                        <button className="action-btn btn-edit">✎</button>
                      )}

                      {canAccess(role, "canDeleteUser") && (
                        <button className="action-btn btn-delete">🗑</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Showing 1 to {mockUsers.length} of {mockUsers.length} entries
          </div>
        </div>
      </div>
    </>
  );
}