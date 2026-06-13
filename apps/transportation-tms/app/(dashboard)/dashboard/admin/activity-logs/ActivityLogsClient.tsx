"use client";

import { useState, useEffect } from "react";
import {
  getActivityLogs,
  getActionTypes,
  getEntityTypes,
} from "@/app/actions/activity-logs";
import type { ActivityLog } from "@/lib/types";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { useAlert } from "@/components/ui/alert-provider";
import { getAllAdminUsers } from "@/app/actions/admin-management";
import type { AdminUser } from "@/lib/types";

const ITEMS_PER_PAGE = 50;

export default function ActivityLogsClient() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actionType, setActionType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  
  // Filter options
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  
  const { showError } = useAlert();

  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE);

  async function loadData() {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        actionType: actionType || undefined,
        entityType: entityType || undefined,
        userId: userId || undefined,
        search: search || undefined,
      };

      const result = await getActivityLogs(params);
      
      if (result.error) {
        showError(result.error, "Failed to Load Logs");
      } else {
        setLogs(result.data);
        setTotalLogs(result.total);
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to load activity logs",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadFilterOptions() {
    try {
      const [actionTypesData, entityTypesData, usersResult] = await Promise.all([
        getActionTypes(),
        getEntityTypes(),
        getAllAdminUsers(),
      ]);
      
      setActionTypes(actionTypesData);
      setEntityTypes(entityTypesData);
      if (usersResult.data) {
        setUsers(usersResult.data);
      }
    } catch (err) {
      console.error("Failed to load filter options:", err);
    }
  }

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadData();
  }, [currentPage, startDate, endDate, actionType, entityType, userId, search]);

  const toggleRow = (logId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Manila",
    });
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActionType("");
    setEntityType("");
    setUserId("");
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              <option value="">All Actions</option>
              {actionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <select
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              <option value="">All Entities</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <select
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by entity name, user email..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-900">Loading activity logs...</div>
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No Activity Logs"
            description="No activity logs found matching your filters."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => {
                    const isExpanded = expandedRows.has(log.id);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {log.user_name || "Unknown"}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {log.user_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {log.action_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.entity_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.entity_name || log.entity_id || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => toggleRow(log.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {isExpanded ? "Hide" : "Show"} Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Expanded Details */}
            {logs.map((log) => {
              if (!expandedRows.has(log.id)) return null;
              return (
                <div
                  key={`details-${log.id}`}
                  className="border-t border-gray-200 bg-gray-50 p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {log.details && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Details
                        </h4>
                        <pre className="text-xs text-gray-900 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.old_values && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Old Values
                        </h4>
                        <pre className="text-xs text-gray-900 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                          {JSON.stringify(log.old_values, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.new_values && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          New Values
                        </h4>
                        <pre className="text-xs text-gray-900 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                          {JSON.stringify(log.new_values, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.ip_address && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">
                          IP Address
                        </h4>
                        <p className="text-xs text-gray-900">{log.ip_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalLogs}
              itemsPerPage={ITEMS_PER_PAGE}
              itemName="logs"
            />
          </>
        )}
      </div>
    </div>
  );
}

