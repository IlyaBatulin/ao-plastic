import type { PvcModifierSpecRow } from "@/lib/pvc-modifier-category-i18n"

type PvcModifierSpecTableProps = {
  rows: PvcModifierSpecRow[]
  colIndicator: string
  colNormGrades: string
  colGrade20: string
  colGrade28: string
  colGrade15: string
  colMethod: string
}

export function PvcModifierSpecTable({
  rows,
  colIndicator,
  colNormGrades,
  colGrade20,
  colGrade28,
  colGrade15,
  colMethod,
}: PvcModifierSpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-8">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#1e3a5f] text-white">
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-4 text-left font-semibold align-middle"
            >
              {colIndicator}
            </th>
            <th
              colSpan={3}
              className="border border-gray-300 px-4 py-3 text-center font-semibold"
            >
              {colNormGrades}
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-4 text-left font-semibold align-middle"
            >
              {colMethod}
            </th>
          </tr>
          <tr className="bg-[#2a4a73] text-white">
            <th className="border border-gray-300 px-3 py-3 text-center font-semibold whitespace-nowrap">
              {colGrade20}
            </th>
            <th className="border border-gray-300 px-3 py-3 text-center font-semibold whitespace-nowrap">
              {colGrade28}
            </th>
            <th className="border border-gray-300 px-3 py-3 text-center font-semibold whitespace-nowrap">
              {colGrade15}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            if (row.isSectionHeader) {
              return (
                <tr key={`section-${row.name}`} className="bg-primary/10">
                  <td
                    colSpan={5}
                    className="border border-gray-300 px-4 py-3 font-semibold text-foreground"
                  >
                    {row.name}
                  </td>
                </tr>
              )
            }

            const isAppearance = i === 0
            const rowBg = i % 2 === 0 ? "bg-white" : "bg-gray-50"

            return (
              <tr key={row.name} className={rowBg}>
                <td className="border border-gray-300 px-4 py-3 align-top">{row.name}</td>
                {isAppearance ? (
                  <td
                    colSpan={3}
                    className="border border-gray-300 px-4 py-3 text-center align-top"
                  >
                    {row.grade20}
                  </td>
                ) : (
                  <>
                    <td className="border border-gray-300 px-3 py-3 text-center align-top">
                      {row.grade20}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center align-top">
                      {row.grade28}
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center align-top">
                      {row.grade15}
                    </td>
                  </>
                )}
                <td className="border border-gray-300 px-4 py-3 align-top text-muted-foreground">
                  {row.method}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
