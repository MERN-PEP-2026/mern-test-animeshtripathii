import { useState } from "react";

function TaskTable({ tasks, total, page, totalPages, onPageChange, onEdit, onDelete, onToggleStatus, formatDate }) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!tasks || (tasks.length === 0 && total === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-[60px] text-slate-300 mb-4">task</span>
        <p className="text-lg font-bold text-slate-500">No tasks found</p>
        <p className="text-sm text-slate-400 mt-1">Create a new task to get started!</p>
      </div>
    );
  }

  const startIndex = (page - 1) * 4 + 1;
  const endIndex = Math.min(page * 4, total);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case "critical":
        return (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-red-500 text-[18px]">priority_high</span>
            <span className="text-sm font-bold text-red-600">Critical</span>
          </div>
        );
      case "high":
        return (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-bold text-slate-700">High</span>
          </div>
        );
      case "medium":
        return (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
            <span className="text-sm font-bold text-slate-700">Medium</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-300"></div>
            <span className="text-sm font-bold text-slate-700">Low</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return <span className="inline-flex items-center rounded-md bg-[#059669] px-2 py-1 text-xs font-bold text-white">Done</span>;
    }
    return <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600 border border-black/20">Pending</span>;
  };

  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return <span className="text-sm text-slate-400 font-medium">No date</span>;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return <span className="text-sm text-red-600 font-black">Today</span>;
    if (diffDays < 0) return <span className="text-sm text-red-600 font-black">Overdue</span>;
    if (diffDays === 1) return <span className="text-sm text-amber-600 font-bold">Tomorrow</span>;
    return <span className="text-sm text-slate-600 font-medium">{formatDate(dueDate)}</span>;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-black bg-slate-50">
              <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 w-[30%]">Task Name</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 w-[12%]">Status</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 w-[15%]">Priority</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 w-[15%]">Due Date</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 w-[12%]">Assignee</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {tasks.map((task) => (
              <tr key={task._id} className="group hover:bg-green-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-black">{task.title}</span>
                    <span className="text-xs text-slate-500 font-medium">{task.description || "No description"}</span>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(task.status)}</td>
                <td className="p-4">{getPriorityDisplay(task.priority)}</td>
                <td className="p-4">{getDueDateDisplay(task.dueDate)}</td>
                <td className="p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B2B26] ring-1 ring-black">
                    <span className="text-xs font-bold text-white">{task.createdBy?.toString().slice(-2).toUpperCase() || "U"}</span>
                  </div>
                </td>
                <td className="p-4 text-right relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === task._id ? null : task._id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                  {openMenu === task._id && (
                    <div className="absolute right-4 top-12 z-20 w-44 rounded-lg border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-1">
                      <button
                        onClick={() => { onEdit(task); setOpenMenu(null); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-blue-600">edit</span>
                        Edit Task
                      </button>
                      <button
                        onClick={() => { onToggleStatus(task); setOpenMenu(null); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#059669]">{task.status === "pending" ? "check_circle" : "undo"}</span>
                        {task.status === "pending" ? "Mark Done" : "Mark Pending"}
                      </button>
                      <div className="border-t border-black/10 my-1"></div>
                      <button
                        onClick={() => { onDelete(task._id); setOpenMenu(null); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Delete Task
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t-2 border-black px-4 py-3 sm:px-6">
        <p className="text-sm text-slate-700 font-medium">
          Showing <span className="font-black text-black">{startIndex}</span> to <span className="font-black text-black">{endIndex}</span> of <span className="font-black text-black">{total}</span> results
        </p>
        {totalPages > 1 && (
          <nav className="isolate inline-flex -space-x-px rounded-md">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-black border border-black hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {getPageNumbers().map((p, index) =>
              p === "..." ? (
                <span key={`dots-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-bold text-black border-y border-r border-black">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-bold border-y border-r border-black transition-colors ${
                    p === page ? "bg-[#2DFF81] font-black text-black" : "text-black hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-black border border-black hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default TaskTable;
