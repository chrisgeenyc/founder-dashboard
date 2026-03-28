"use client";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage,
}: {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  {emptyMessage || "No data yet. Add your first lead to get started."}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-gray-700">
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
