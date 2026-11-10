"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface ChartData {
  date: string
  value: number
  period: string
}

interface IndicatorChartProps {
  data: ChartData[]
  unit: string
  frequency: string
}

function formatTooltipValue(value: number, unit: string): string {
  if (unit === "$") {
    return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
  return `${value.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${unit}`
}

export default function IndicatorChart({ data, unit, frequency }: IndicatorChartProps) {
  // Determine tick interval based on data length
  const tickInterval = data.length > 20 ? Math.ceil(data.length / 8) : undefined

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            interval={tickInterval}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(v) => unit === "$" ? `${(v / 1000).toFixed(0)}k` : `${v}`}
            width={unit === "$" ? 50 : 45}
          />
          <Tooltip
            formatter={(value) => [formatTooltipValue(Number(value), unit), "Valor"]}
            labelStyle={{ color: "var(--foreground)" }}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={data.length <= 24 ? { r: 3, fill: "var(--accent)" } : false}
            activeDot={{ r: 5, fill: "var(--accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}