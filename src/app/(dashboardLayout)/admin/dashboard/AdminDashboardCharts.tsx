'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type AdminDashboardChartsProps = {
  totalUsers: number;
  totalEvents: number;
  totalReviews: number;
  totalParticipants: number;
};

const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#eab308'];

const AdminDashboardCharts = ({
  totalUsers,
  totalEvents,
  totalReviews,
  totalParticipants,
}: AdminDashboardChartsProps) => {
  const barData = [
    { name: 'Users', value: totalUsers },
    { name: 'Events', value: totalEvents },
    { name: 'Reviews', value: totalReviews },
    { name: 'Participants', value: totalParticipants },
  ];

  const pieData = [
    { name: 'Events', value: totalEvents },
    { name: 'Reviews', value: totalReviews },
    { name: 'Participants', value: totalParticipants },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">Platform Volume</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time totals from admin dashboard summary.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">
          Activity Composition
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Relative share of events, reviews, and participation.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
};

export default AdminDashboardCharts;
