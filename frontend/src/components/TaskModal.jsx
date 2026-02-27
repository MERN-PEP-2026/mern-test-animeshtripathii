import React, { useState, useEffect } from "react";

const TaskModal = (props) => {
  const { isVisible, closeHandler, saveDispatcher, activeRecord } = props;

  const initialFormState = {
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
  };

  const [inputValues, setInputValues] = useState(initialFormState);

  useEffect(() => {
    if (activeRecord) {
      setInputValues({
        title: activeRecord.title,
        description: activeRecord.description || "",
        status: activeRecord.status,
        priority: activeRecord.priority || "low",
        dueDate: activeRecord.dueDate ? activeRecord.dueDate.substring(0, 10) : "",
      });
    } else {
      setInputValues({ ...initialFormState });
    }
  }, [activeRecord, isVisible]);

  const onUpdateField = (field, val) => {
    setInputValues((prev) => ({ ...prev, [field]: val }));
  };

  const triggerSubmit = (event) => {
    event.preventDefault();
    saveDispatcher(inputValues);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B26]/40 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
        <div className="flex flex-col p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#0B2B26]">
                {activeRecord ? "Update Details" : "New Task"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {activeRecord ? "Modify your task specifics below." : "Enter details for your new objective."}
              </p>
            </div>
            <button
              onClick={closeHandler}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-[#0B2B26]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <form onSubmit={triggerSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0B2B26]" htmlFor="fld-title">Title</label>
              <input
                id="fld-title"
                type="text"
                required
                value={inputValues.title}
                onChange={(e) => onUpdateField("title", e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all hover:bg-slate-100/50 focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
                placeholder="What needs to be done?"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0B2B26]" htmlFor="fld-desc">Description (Optional)</label>
              <textarea
                id="fld-desc"
                rows="3"
                value={inputValues.description}
                onChange={(e) => onUpdateField("description", e.target.value)}
                className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all hover:bg-slate-100/50 focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
                placeholder="Provide more context..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0B2B26]" htmlFor="fld-status">State</label>
                <div className="relative">
                  <select
                    id="fld-status"
                    value={inputValues.status}
                    onChange={(e) => onUpdateField("status", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all hover:bg-slate-100/50 focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-2.5 text-slate-400">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0B2B26]" htmlFor="fld-prio">Level</label>
                <div className="relative">
                  <select
                    id="fld-prio"
                    value={inputValues.priority}
                    onChange={(e) => onUpdateField("priority", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all hover:bg-slate-100/50 focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-2.5 text-slate-400">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0B2B26]" htmlFor="fld-date">Deadline</label>
              <input
                id="fld-date"
                type="date"
                value={inputValues.dueDate}
                onChange={(e) => onUpdateField("dueDate", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0B2B26] transition-all hover:bg-slate-100/50 focus:border-[#2DFF81] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={closeHandler}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#2DFF81] py-2.5 text-sm font-semibold text-[#0B2B26] transition-colors hover:bg-[#20e06d]"
              >
                {activeRecord ? "Save Changes" : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
