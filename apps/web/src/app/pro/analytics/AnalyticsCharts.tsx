"use client";

type MonthlyStat = {
  month: string;
  total: number;
  confirmed: number;
  cancelled: number;
};

export function AnalyticsCharts({ monthlyStats }: { monthlyStats: MonthlyStat[] }) {
  const maxValue = Math.max(
    ...monthlyStats.map((s) => Math.max(s.total, s.confirmed, s.cancelled)),
    1
  );

  return (
    <div className="space-y-4">
      {monthlyStats.map((stat, index) => {
        const totalHeight = (stat.total / maxValue) * 100;
        const confirmedHeight = stat.total > 0 ? (stat.confirmed / stat.total) * 100 : 0;
        const cancelledHeight = stat.total > 0 ? (stat.cancelled / stat.total) * 100 : 0;

        return (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <p className="mb-2 text-xs font-medium text-zinc-700">{stat.month}</p>
              <div className="relative h-24 w-full rounded bg-zinc-100">
                {stat.total > 0 && (
                  <>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t bg-emerald-500 transition-all"
                      style={{ height: `${totalHeight}%` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t bg-emerald-600"
                        style={{ height: `${confirmedHeight}%` }}
                      />
                      <div
                        className="absolute top-0 left-0 right-0 rounded-t bg-red-500 opacity-50"
                        style={{ height: `${cancelledHeight}%` }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white drop-shadow">
                        {stat.total}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-2 flex gap-4 text-xs text-zinc-600">
                <span>✅ {stat.confirmed}</span>
                <span>❌ {stat.cancelled}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}




