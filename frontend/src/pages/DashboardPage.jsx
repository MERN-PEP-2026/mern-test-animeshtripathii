import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api.js";
import Sidebar from "../components/Sidebar.jsx";
import StatsCards from "../components/StatsCards.jsx";
import TaskTable from "../components/TaskTable.jsx";
import TaskModal from "../components/TaskModal.jsx";
import SettingsModal from "../components/SettingsModal.jsx";

const DashboardPage = () => {
  const router = useNavigate();
  
  // States renamed for obscurity
  const [sessionUser, setSessionUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [collection, setCollection] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [queryTerm, setQueryTerm] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(true);
  
  // Modals
  const [dialogState, setDialogState] = useState({ open: false, editingRecord: null });
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Pagination & Stats
  const [pager, setPager] = useState({ current: 1, max: 1, totalItems: 0 });
  const [metrics, setMetrics] = useState({ sum: 0, pendingCount: 0, doneCount: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router("/login");
      return;
    }
    loadMetrics();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadCollection();
    }
  }, [pager.current, activeTab]);

  const loadMetrics = async () => {
    try {
      const [resAll, resPending, resDone] = await Promise.all([
        getTasks({ page: 1, limit: 1 }),
        getTasks({ page: 1, limit: 1, status: "pending" }),
        getTasks({ page: 1, limit: 1, status: "completed" })
      ]);
      
      const extCount = (res) => Array.isArray(res.data) ? res.data.length : (res.data.total || 0);
      
      setMetrics({
        sum: extCount(resAll),
        pendingCount: extCount(resPending),
        doneCount: extCount(resDone)
      });
    } catch (e) {
      if (e.response?.status === 401) executeSignOut();
    }
  };

  const loadCollection = async () => {
    setIsLoaderActive(true);
    try {
      const qParams = { page: pager.current, limit: 4 };
      if (activeTab !== "all") qParams.status = activeTab;
      
      const result = await getTasks(qParams);
      const payload = result.data;
      
      if (Array.isArray(payload)) {
        setCollection(payload);
        setPager({ current: 1, max: 1, totalItems: payload.length });
      } else {
        setCollection(payload.tasks || []);
        setPager({ 
          current: payload.page || 1, 
          max: payload.totalPages || 1, 
          totalItems: payload.total || 0 
        });
      }
    } catch (e) {
      if (e.response?.status === 401) executeSignOut();
    } finally {
      setIsLoaderActive(false);
    }
  };

  const executeSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router("/login");
  };

  const dispatchTaskForm = async (taskPayload) => {
    try {
      if (dialogState.editingRecord) {
        await updateTask(dialogState.editingRecord._id, taskPayload);
      } else {
        await createTask(taskPayload);
      }
      setDialogState({ open: false, editingRecord: null });
      loadCollection();
      loadMetrics();
    } catch (e) {
      console.error("Task action failed.");
    }
  };

  const initiateDelete = async (recordId) => {
    try {
      await deleteTask(recordId);
      if (collection.length === 1 && pager.current > 1) {
        setPager(p => ({ ...p, current: p.current - 1 }));
      } else {
        loadCollection();
      }
      loadMetrics();
    } catch (e) {
      console.error("Delete failed.");
    }
  };

  const flipStatus = async (item) => {
    const flippedMode = item.status === "pending" ? "completed" : "pending";
    try {
      await updateTask(item._id, { status: flippedMode });
      loadCollection();
      loadMetrics();
    } catch (e) {
      console.error("Status update failed.");
    }
  };

  const parseDateUI = (rawDate) => {
    const d = new Date(rawDate);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  // derived arrays
  const fallbackCollection = Array.isArray(collection) ? collection : [];
  const renderedList = queryTerm
    ? fallbackCollection.filter(c => 
        c.title.toLowerCase().includes(queryTerm.toLowerCase()) || 
        (c.description && c.description.toLowerCase().includes(queryTerm.toLowerCase()))
      )
    : fallbackCollection;

  return (
    <div className="flex h-screen w-full bg-[#f8faf9] font-['Inter',sans-serif] text-slate-800 antialiased selection:bg-[#2DFF81] selection:text-[#0B2B26]">
      <Sidebar 
        user={sessionUser} 
        onLogout={executeSignOut} 
        onSettings={() => setSettingsOpen(true)} 
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 pb-10 pt-8">
          
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#0B2B26]">My Workspace</h1>
              <p className="mt-1 text-sm font-medium text-slate-400">Manage tasks and monitor productivity.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-300">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Find tasks..."
                  value={queryTerm}
                  onChange={(e) => setQueryTerm(e.target.value)}
                  className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium transition-all focus:border-[#2DFF81] focus:outline-none focus:ring-4 focus:ring-[#2DFF81]/10"
                />
              </div>
              <button
                onClick={() => setDialogState({ open: true, editingRecord: null })}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2DFF81] px-5 text-sm font-semibold text-[#0B2B26] transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden sm:block">New Task</span>
              </button>
            </div>
          </div>

          <StatsCards 
            totalTasks={metrics.sum} 
            pendingTasks={metrics.pendingCount} 
            completedTasks={metrics.doneCount} 
          />

          <div className="mt-10 mb-5 flex gap-2">
            {["all", "pending", "completed"].map((type) => (
              <button
                key={type}
                onClick={() => { setActiveTab(type); setPager(p => ({ ...p, current: 1 })); }}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === type
                    ? "bg-[#0B2B26] text-[#2DFF81] shadow-md"
                    : "bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {isLoaderActive ? (
            <div className="flex h-64 items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-200 animate-spin">refresh</span>
            </div>
          ) : (
            <TaskTable
              tasks={renderedList}
              total={pager.totalItems}
              page={pager.current}
              totalPages={pager.max}
              onPageChange={(val) => setPager(p => ({ ...p, current: val }))}
              onEdit={(rc) => setDialogState({ open: true, editingRecord: rc })}
              onDelete={initiateDelete}
              onToggleStatus={flipStatus}
              formatDate={parseDateUI}
            />
          )}
        </div>
      </div>

      <TaskModal
        isVisible={dialogState.open}
        closeHandler={() => setDialogState({ open: false, editingRecord: null })}
        saveDispatcher={dispatchTaskForm}
        activeRecord={dialogState.editingRecord}
      />

      <SettingsModal
        isVisible={settingsOpen}
        closeHandler={() => setSettingsOpen(false)}
        currentUser={sessionUser}
        refreshUserData={(usr) => setSessionUser(usr)}
      />
    </div>
  );
};

export default DashboardPage;
