"use client"

import { motion } from "framer-motion"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type OrdersTrendPoint = {
  date: string
  label: string
  count: number
}

const chartConfig = {
  count: {
    label: "Заказы",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function AdminOrdersChart({
  data,
  loading,
}: {
  data: OrdersTrendPoint[]
  loading?: boolean
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Динамика заказов</h3>
          <p className="text-sm text-muted-foreground">За последние 14 дней</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-foreground">{loading ? "…" : total}</p>
          <p className="text-xs text-muted-foreground">всего за период</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center">
          <div className="h-full w-full animate-pulse rounded-xl bg-muted/60" />
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-count)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-count)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={28}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-count)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2.5}
              fill="url(#ordersFill)"
              dot={{ r: 3, fill: "var(--color-count)", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "var(--color-count)", strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </motion.div>
  )
}
