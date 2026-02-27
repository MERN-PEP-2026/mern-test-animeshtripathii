import React, { useState } from "react";

const TaskTable = (props) => {
  const {
    tasks: itemsList,
    total: totalCount,
    page: currentPage,
    totalPages: pageCount,
    onPageChange: shiftPage,
    onEdit: triggerEdit,
    onDelete: triggerDelete,
    onToggleStatus: triggerStatusToggle,
    formatDate: dateFormatter,
  } = props;

  const [activeMenuId, setActiveMenuId] = useState(null);

  if (!itemsList || (!itemsList.length && !totalCount)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-24 text-center shadow-sm">
        <span className="material-symbols-outlined mb-2 text-5xl text-slate-200">task</span>
        <h3 className="text-base font-medium text-slate-500">No tasks found</h3>
      </div>
    );
  }

  const computePageSeq = () => {
    let seq = [];
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) seq.push(i);
    } else {
      seq.push(1);
      if (currentPage > 3) seq.push("...");
      const startPoint = Math.max(2, currentPage - 1);
      const endPoint = Math.min(pageCount - 1, currentPage + 1);
      for (let j = startPoint; j <= endPoint; j++) seq.push(j);
      if (currentPage < pageCount - 2) seq.push("...");
      seq.push(pageCount);
    }
    return seq;
  };

  const renderPriority = (level) => {
    const config = {
      critical: { icon: "priority_high", color: "text-red-500", bg: "bg-red-50" },
      high: { icon: "keyboard_double_arrow_up", color: "text-orange-500", bg: "bg-orange-50" },
      medium: { icon: "keyboard_arrow_up", color: "text-amber-500", bg: "bg-amber-50" },
      low: { icon: "remove", color: "text-slate-400", bg: "bg-slate-50" },
    };
    const mapped = config[level] || config.low;
    return (
      <div className={`inline-flex items-center gap-1 overflow-hidden rounded-full ${mapped.bg} px-2 py-1 pr-3`}>
        <span className={`material-symbols-outlined text-[16px] ${mapped.color}`}>{mapped.icon}</span>
        <span className={`text-xs font-semibold capitalize ${mapped.color}`}>{level}</span>
      </div>
    );
  };

  const renderStatus = (currStatus) => {
    const isDone = currStatus === "completed";
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-tight ${
          isDone ? "bg-[#2DFF81]/20 text-[#0B2B26]" : "bg-slate-100 text-slate-500"
        }`}
      >
        {isDone ? "Completed" : "In Progress"}
      </span>
    );
  };

  const calculateDueText = (dt) => {
    if (!dt) return <span className="text-sm font-medium text-slate-300">—</span>;
    const dueObj = new Date(dt);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    dueObj.setHours(0, 0, 0, 0);

    const delta = Math.ceil((dueObj - currentDate) / 86400000);
    if (delta < 0) return <span className="text-sm font-semibold text-red-500">Overdue</span>;
    if (delta === 0) return <span className="text-sm font-semibold text-orange-500">Due Today</span>;
    if (delta === 1) return <span className="text-sm font-medium text-amber-500">Tomorrow</span>;
    return <span className="text-sm font-medium text-slate-600">{dateFormatter(dt)}</span>;
  };

  const handleMenuClick = (itemId) => {
    setActiveMenuId(activeMenuId === itemId ? null : itemId);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left align-middle text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 font-medium text-slate-400">Task Name</th>
              <th className="px-6 py-4 font-medium text-slate-400">Status</th>
              <th className="px-6 py-4 font-medium text-slate-400">Priority</th>
              <th className="px-6 py-4 font-medium text-slate-400">Deadline</th>
              <th className="px-6 py-4 text-right font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {itemsList.map((item) => (
              <tr key={item._id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-[#0B2B26]">{item.title}</span>
                    <span className="text-xs text-slate-400">{item.description || "No description provided"}</span>
                  </div>
                </td>
                <td className="px-6 py-5">{renderStatus(item.status)}</td>
                <td className="px-6 py-5">{renderPriority(item.priority)}</td>
                <td className="px-6 py-5">{calculateDueText(item.dueDate)}</td>
                <td className="px-6 py-5 text-right relative">
                  <button
                    onClick={() => handleMenuClick(item._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0B2B26] ml-auto"
                  >
                    <span className="material-symbols-outlined text-xl">more_items</span>
                  </button>
                  {activeMenuId === item._id && (
                    <div className="absolute right-6 top-14 z-20 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg ring-1 ring-black/5">
                      <div className="flex flex-col py-1">
                        <button
                          onClick={() => { triggerEdit(item); setActiveMenuId(null); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                          Modify Task
                        </button>
                        <button
                          onClick={() => { triggerStatusToggle(item); setActiveMenuId(null); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#059669]"
                        >
                          <span className="material-symbols-outlined text-[18px]">rule</span>
                          {item.status === "pending" ? "Mark Complete" : "Mark Pending"}
                        </button>
                        <div className="my-1 border-t border-slate-100"></div>
                        <button
                          onClick={() => { triggerDelete(item._id); setActiveMenuId(null); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-white">
          <p className="text-xs font-medium text-slate-400">
            Page <span className="font-semibold text-slate-600">{currentPage}</span> of {pageCount}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => shiftPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back_ios_new</span>
            </button>
            {computePageSeq().map((val, idx) => (
              val === "..." ? (
                <span key={`elip-${idx}`} className="px-2 text-slate-400">...</span>
              ) : (
                <button
                  key={`pg-${val}`}
                  onClick={() => shiftPage(val)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    val === currentPage
                      ? "bg-[#2DFF81] text-[#0B2B26]"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {val}
                </button>
              )
            ))}
            <button
              onClick={() => shiftPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward_ios</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
