import React from 'react';

const StatsCards = ({ totalTasks: allCount, pendingTasks: pendingCount, completedTasks: doneCount }) => {
  const statItems = [
    { label: "Overall Tasks", value: allCount, icon: "list_alt", color: "text-[#0B2B26]" },
    { label: "In Progress", value: pendingCount, icon: "pending_actions", color: "text-amber-500" },
    { label: "Finished", value: doneCount, icon: "check_circle", color: "text-[#2DFF81]" }
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statItems.map((stat, idx) => (
        <article key={idx} className="relative overflow-hidden rounded-2xl bg-white px-6 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-slate-100 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-wide text-slate-500">{stat.label}</h3>
            <span className={`material-symbols-outlined text-2xl ${stat.color} opacity-80`}>
              {stat.icon}
            </span>
          </div>
          <div className="mt-3 flex items-baseline">
            <p className="text-3xl font-semibold tracking-tight text-[#0B2B26]">{stat.value}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default StatsCards;
