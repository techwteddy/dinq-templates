"use client";

import { useState, useEffect } from "react";
import { AddAdminForm } from "@/components/forms/add-admin-form";
import {
  getAllAdminUsers,
  getCurrentAdminUser,
  promoteToSupervisor,
  demoteToAdmin,
  deleteAdmin,
} from "@/app/actions/admin-management";
import type { AdminUser } from "@/lib/types";
import { canManageUsers } from "@/lib/utils/role-check";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { useAlert } from "@/components/ui/alert-provider";

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { showSuccess, showError } = useAlert();

  const isSupervisor = canManageUsers(currentUser);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  async function loadData() {
    setLoading(true);

    try {
      const [usersResult, currentUserData] = await Promise.all([
        getAllAdminUsers(),
        getCurrentAdminUser(),
      ]);

      if (usersResult.error) {
        showError(usersResult.error, "Failed to Load Users");
      } else {
        setUsers(usersResult.data || []);
      }

      setCurrentUser(currentUserData);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to load users",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handlePromote(userId: string) {
    if (
      !confirm(
        "Are you sure you want to promote this user to supervisor? They will have full admin management permissions."
      )
    ) {
      return;
    }

    setActionLoading(userId);
    try {
      const result = await promoteToSupervisor(userId);
      if (result.success) {
        showSuccess("User promoted to supervisor successfully!", "Success");
        await loadData();
      } else {
        showError(result.error || "Failed to promote user", "Error");
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "An error occurred",
        "Error"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDemote(userId: string) {
    if (
      !confirm(
        "Are you sure you want to demote this supervisor to admin? They will lose admin management permissions."
      )
    ) {
      return;
    }

    setActionLoading(userId);
    try {
      const result = await demoteToAdmin(userId);
      if (result.success) {
        showSuccess("User demoted to admin successfully!", "Success");
        await loadData();
      } else {
        showError(result.error || "Failed to demote user", "Error");
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "An error occurred",
        "Error"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(userId: string, userEmail: string) {
    if (
      !confirm(
        `Are you sure you want to delete ${userEmail}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setActionLoading(userId);
    try {
      const result = await deleteAdmin(userId);
      if (result.success) {
        showSuccess("User deleted successfully!", "Success");
        await loadData();
      } else {
        showError(result.error || "Failed to delete user", "Error");
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "An error occurred",
        "Error"
      );
    } finally {
      setActionLoading(null);
    }
  }

  function getRoleBadgeColor(role: string) {
    if (role === "supervisor") {
      return "bg-purple-100 text-purple-800";
    }
    return "bg-blue-100 text-blue-800";
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const supervisorCount = users.filter((u) => u.role === "supervisor").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage admin users and their roles
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Supervisors</dt>
          <dd className="mt-1 text-3xl font-semibold text-purple-600">{supervisorCount}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-600">{adminCount}</dd>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search by email, name, or role..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {isSupervisor && (
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
          >
            + Add Admin
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Joined
              </th>
              {isSupervisor && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={isSupervisor ? 5 : 4} className="px-6 py-12">
                  <EmptyState
                    title={searchQuery ? "No users found" : "No users yet"}
                    description={
                      searchQuery
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first admin user"
                    }
                  />
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
              const isCurrentUser = user.id === currentUser?.id;
              const isActionInProgress = actionLoading === user.id;

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 ${isCurrentUser ? "bg-blue-50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Avatar name={user.name || user.email} size="md" />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.name || "No name"}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-normal text-blue-600">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={user.role} type="role" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  {isSupervisor && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {!isCurrentUser && (
                          <>
                            {user.role === "admin" && (
                              <button
                                onClick={() => handlePromote(user.id)}
                                disabled={isActionInProgress}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                Promote
                              </button>
                            )}
                            {user.role === "supervisor" && (
                              <button
                                onClick={() => handleDemote(user.id)}
                                disabled={isActionInProgress}
                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                              >
                                Demote
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user.id, user.email)}
                              disabled={isActionInProgress}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {isActionInProgress ? "..." : "Remove"}
                            </button>
                          </>
                        )}
                        {isCurrentUser && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
            )}
          </tbody>
        </table>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          itemName="users"
        />
      </div>

      {showAddForm && (
        <AddAdminForm
          onSuccess={() => {
            setShowAddForm(false);
            loadData();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}


