import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api.js";
import Sidebar from "../components/Sidebar.jsx";
import StatsCards from "../components/StatsCards.jsx";
import TaskTable from "../components/TaskTable.jsx";
import TaskModal from "../components/TaskModal.jsx";
import SettingsModal from "../components/SettingsModal.jsx";

function DashboardPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchTasks();
    }
  }, [page, filter]);

  const fetchStats = async () => {
    try {
      const allRes = await getTasks({ page: 1, limit: 1 });
      const pendingRes = await getTasks({ page: 1, limit: 1, status: "pending" });
      const completedRes = await getTasks({ page: 1, limit: 1, status: "completed" });
      setStats({
        total: Array.isArray(allRes.data) ? allRes.data.length : (allRes.data.total || 0),
        pending: Array.isArray(pendingRes.data) ? pendingRes.data.length : (pendingRes.data.total || 0),
        completed: Array.isArray(completedRes.data) ? completedRes.data.length : (completedRes.data.total || 0),
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 4 };
      if (filter !== "all") {
        params.status = filter;
      }
      const { data } = await getTasks(params);
      if (Array.isArray(data)) {
        setTasks(data);
        setPage(1);
        setTotalPages(1);
        setTotal(data.length);
      } else {
        setTasks(data.tasks || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks();
      }
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await updateTask(task._id, { status: newStatus });
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const displayTasks = search
    ? safeTasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || (t.description && t.description.toLowerCase().includes(search.toLowerCase())))
    : safeTasks;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="font-['Inter',sans-serif] flex h-screen w-full bg-[#F0F4F1] overflow-hidden">
      <Sidebar user={user} onLogout={handleLogout} onSettings={() => setShowSettings(true)} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#F0F4F1]">
        <header className="w-full px-6 py-6 sm:px-8 bg-[#F0F4F1] z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Task Dashboard</h2>
              <p className="text-slate-600 text-sm mt-1 font-medium">Manage your daily tasks and track progress.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input
                  className="h-10 w-64 rounded-lg border border-black bg-white pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#059669] focus:border-black placeholder:text-slate-400"
                  placeholder="Search tasks..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => { setEditingTask(null); setShowModal(true); }}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#2DFF81] hover:brightness-95 text-black h-10 px-5 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border border-black transition-all active:translate-y-0.5 active:shadow-none"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span className="hidden sm:inline">Create Task</span>
              </button>
            </div>
          </div>

          <StatsCards totalTasks={stats.total} pendingTasks={stats.pending} completedTasks={stats.completed} />
        </header>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8">
          <div className="sticky top-0 z-10 bg-[#F0F4F1] pt-6 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => handleFilterChange("all")} className={`flex h-9 items-center gap-2 rounded-lg border border-black px-3 text-sm font-bold transition-colors ${filter === "all" ? "bg-[#2DFF81] text-black" : "bg-white text-black hover:bg-slate-50"}`}>
                All Tasks
              </button>
              <button onClick={() => handleFilterChange("pending")} className={`flex h-9 items-center gap-2 rounded-lg border border-black px-3 text-sm font-bold transition-colors ${filter === "pending" ? "bg-[#2DFF81] text-black" : "bg-white text-black hover:bg-slate-50"}`}>
                Pending
              </button>
              <button onClick={() => handleFilterChange("completed")} className={`flex h-9 items-center gap-2 rounded-lg border border-black px-3 text-sm font-bold transition-colors ${filter === "completed" ? "bg-[#2DFF81] text-black" : "bg-white text-black hover:bg-slate-50"}`}>
                Completed
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined text-[40px] text-slate-400 animate-spin">progress_activity</span>
            </div>
          ) : (
            <TaskTable
              tasks={displayTasks}
              total={total}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              formatDate={formatDate}
            />
          )}
        </div>
      </main>

      <TaskModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        editingTask={editingTask}
      />

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onUserUpdate={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}

export default DashboardPage;
