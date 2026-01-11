"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Button } from "@acme/ui/button";
import { useTheme } from "@acme/ui/theme";
import { ChartTooltip, ChartTooltipContent } from "@acme/ui/chart";

type ChartRow = {
  date: string;
  total: number;
} & Record<string, number | string>; // allows 'date' to exist

interface AccountsLineChartProps {
  data: ChartRow[];
}

export function AccountsLineChart({ data }: AccountsLineChartProps) {
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "dark" ? "#fff" : "#000";
  const gridColor = resolvedTheme === "dark" ? "#374151" : "#e5e7eb";

  // latest total
  const latestTotal = data.length ? data[data.length - 1]?.total : 0;

  return (
    <Card className="flex h-[40vh] flex-col">
      <CardHeader>
        <CardDescription>Total Balance</CardDescription>
        <CardTitle className="text-2xl">
          {latestTotal?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[35vh] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              stroke={gridColor}
              vertical={false}
              horizontal={false}
            />
            <XAxis dataKey="date" hide />
            <YAxis
              orientation="right"
              tickLine={false}
              className="font-sans text-sm text-gray-500 dark:text-gray-400"
              tick={{ fill: axisColor }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopOpacity={0.8} />
                <stop offset="95%" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid w-full gap-2">
            <div className="flex flex-col items-center gap-2 leading-none font-medium">
              <div className="flex gap-2">
                <Button className="w-16">1W</Button>
                <Button className="w-16">1M</Button>
                <Button className="w-16">3M</Button>
                <Button className="w-16">6M</Button>
                <Button className="w-16">YTD</Button>
                <Button className="w-16">1Y</Button>
              </div>
              <Button className="w-full">Add Account</Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

