interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <div className="flex items-center">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className={icon ? "ml-5 w-0 flex-1" : "w-full"}>
          <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 flex items-baseline justify-between">
            <div className="flex items-baseline text-2xl font-semibold text-gray-900">
              {value}
            </div>
            {trend && (
              <div
                className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  trend.positive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {trend.value}
              </div>
            )}
          </dd>
        </div>
      </div>
    </div>
  );
}




