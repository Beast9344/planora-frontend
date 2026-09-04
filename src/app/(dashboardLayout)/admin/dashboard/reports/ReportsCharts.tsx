'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ReportsChartsProps = {
  users: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    deletedUsers: number;
  };
  events: {
    totalEvents: number;
    privateEvents: number;
    publicEvents: number;
    paidEvents: number;
    freeEvents: number;
  };
  engagement: {
    totalReviews: number;
    totalParticipants: number;
  };
};

const PIE_COLORS = ['#0ea5e9', '#f59e0b', '#e11d48'];

const ReportsCharts = ({ users, events, engagement }: ReportsChartsProps) => {
  const usersPieData = [
    { name: 'Active', value: users.activeUsers },
    { name: 'Blocked', value: users.blockedUsers },
    { name: 'Deleted', value: users.deletedUsers },
  ];

  const eventsBarData = [
    { name: 'Public', value: events.publicEvents },
    { name: 'Private', value: events.privateEvents },
    { name: 'Paid', value: events.paidEvents },
    { name: 'Free', value: events.freeEvents },
  ];

  const engagementLineData = [
    { metric: 'Reviews', count: engagement.totalReviews },
    { metric: 'Participants', count: engagement.totalParticipants },
    { metric: 'Users', count: users.totalUsers },
    { metric: 'Events', count: events.totalEvents },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">User Status Mix</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Active, blocked, and deleted users from live admin summary.
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={usersPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={78}
                label
              >
                {usersPieData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Event Distribution</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Public/private visibility and paid/free breakdown.
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventsBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Platform Activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Comparison of engagement, user, and event totals.
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
};

export default ReportsCharts;
