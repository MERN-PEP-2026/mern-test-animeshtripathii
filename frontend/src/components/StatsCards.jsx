function StatsCards({ totalTasks, pendingTasks, completedTasks }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      <div className="flex flex-col gap-1 rounded-xl bg-white p-5 border-2 border-black shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 text-sm font-bold">Total Tasks</p>
          <span className="text-[#059669] material-symbols-outlined text-[24px]">list_alt</span>
        </div>
        <p className="text-black text-2xl font-black mt-2">{totalTasks}</p>
      </div>
      <div className="flex flex-col gap-1 rounded-xl bg-white p-5 border-2 border-black shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 text-sm font-bold">Pending</p>
          <span className="text-amber-600 material-symbols-outlined text-[24px]">pending_actions</span>
        </div>
        <p className="text-black text-2xl font-black mt-2">{pendingTasks}</p>
      </div>
      <div className="flex flex-col gap-1 rounded-xl bg-white p-5 border-2 border-black shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 text-sm font-bold">Completed</p>
          <span className="text-[#059669] material-symbols-outlined text-[24px]">check_circle</span>
        </div>
        <p className="text-black text-2xl font-black mt-2">{completedTasks}</p>
      </div>
    </div>
  );
}

export default StatsCards;
