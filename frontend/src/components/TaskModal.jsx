import { useState, useEffect } from "react";

function TaskModal({ show, onClose, onSubmit, editingTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
        priority: editingTask.priority || "low",
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
      });
    } else {
      setFormData({ title: "", description: "", status: "pending", priority: "low", dueDate: "" });
    }
  }, [editingTask, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg mx-4 p-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-black text-black">{editingTask ? "Edit Task" : "Create New Task"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-6">
          {editingTask ? "Update your task details." : "Define your task and set priorities."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-black mb-1.5" htmlFor="task-title">Task Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </div>
              <input
                id="task-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black placeholder:text-slate-400"
                placeholder="e.g. Design new landing page"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1.5" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 py-3 px-3 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black resize-none placeholder:text-slate-400"
              placeholder="Add some details about this task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1.5" htmlFor="task-status">Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">flag</span>
                </div>
                <select
                  id="task-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-8 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black appearance-none bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1.5" htmlFor="task-priority">Priority</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">priority_high</span>
                </div>
                <select
                  id="task-priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-8 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black appearance-none bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1.5" htmlFor="task-duedate">Due Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <input
                id="task-duedate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-[#2DFF81] focus:border-black"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-black py-3 text-sm font-bold text-black hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#2DFF81] border border-black py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:brightness-95 transition-all active:translate-y-0.5 active:shadow-none"
            >
              {editingTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
