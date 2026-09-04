'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type UserDashboardChartsProps = {
  myEventsCount: number;
  myRequestsCount: number;
  pendingInvitationsCount: number;
  myReviewsCount: number;
  pendingApprovalsCount: number;
};

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed'];

const UserDashboardCharts = ({
  myEventsCount,
  myRequestsCount,
  pendingInvitationsCount,
  myReviewsCount,
  pendingApprovalsCount,
}: UserDashboardChartsProps) => {
  const distributionData = [
    { name: 'Hosted', value: myEventsCount },
    { name: 'Requests', value: myRequestsCount },
    { name: 'Invites', value: pendingInvitationsCount },
    { name: 'Reviews', value: myReviewsCount },
    { name: 'Approvals', value: pendingApprovalsCount },
  ];

  const trendData = [
    { step: 'Hosted', count: myEventsCount },
    { step: 'Requests', count: myRequestsCount },
    { step: 'Invites', count: pendingInvitationsCount },
    { step: 'Reviews', count: myReviewsCount },
    { step: 'Approvals', count: pendingApprovalsCount },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
        <h2 className="text-lg font-bold text-foreground">
          Activity Distribution
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live breakdown of your current dashboard summary.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">Activity Mix</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Relative share across your key workflow metrics.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
        <h2 className="text-lg font-bold text-foreground">Activity Trend</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Trend line based on current counts for major dashboard categories.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#16a34a"
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

export default UserDashboardCharts;
