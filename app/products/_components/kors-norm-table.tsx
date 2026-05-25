type NormRow = { n: string; name: string; unit: string; norm: string }

type KorsNormTableProps = {
  tuLabel: string
  rows: NormRow[]
  colNo?: string
  colName?: string
  colUnit?: string
  colValue?: string
}

export function KorsNormTable({
  tuLabel,
  rows,
  colNo = "№ п/п",
  colName = "Наименование показателей",
  colUnit = "Ед. измерения",
  colValue = "Норма по НТД",
}: KorsNormTableProps) {
  return (
    <div className="bg-card rounded-3xl p-8 shadow-sm border border-border overflow-x-auto">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">{tuLabel}</p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1e3a5f] text-white">
            <th className="py-4 px-6 text-left font-semibold border border-gray-300">{colNo}</th>
            <th className="py-4 px-6 text-left font-semibold border border-gray-300">{colName}</th>
            <th className="py-4 px-6 text-left font-semibold border border-gray-300">{colUnit}</th>
            <th className="py-4 px-6 text-left font-semibold border border-gray-300">{colValue}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.n}
              className={
                i === rows.length - 1
                  ? i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                  : i % 2 === 0
                    ? "bg-white border-b border-gray-200"
                    : "bg-gray-50 border-b border-gray-200"
              }
            >
              <td className="py-4 px-6 border border-gray-300">{row.n}</td>
              <td className="py-4 px-6 border border-gray-300">{row.name}</td>
              <td className="py-4 px-6 border border-gray-300 text-center">{row.unit}</td>
              <td className="py-4 px-6 border border-gray-300">{row.norm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
