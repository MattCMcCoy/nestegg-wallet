"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { ChartTooltip, ChartTooltipContent } from "@acme/ui/chart";
import { useTheme } from "@acme/ui/theme";

type ChartRow = {
  date: string;
  total: number;
} & Record<string, number | string>; // allows 'date' to exist

interface AccountsLineChartProps {
  data: ChartRow[];
}

export function AccountsLineChart({ data }: AccountsLineChartProps) {
  const { resolvedTheme } = useTheme();
  const gridColor =
    resolvedTheme === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)";

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
              horizontal={true}
            />
            <XAxis dataKey="date" hide />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              fontFamily="var(--font-inter)"
              className="font-sans text-sm text-gray-500 dark:text-gray-400"
              tick={{ fontSize: 10, fontFamily: "var(--font-inter)" }}
              tickFormatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="50%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="total"
              type="natural"
              stroke="var(--chart-2)"
              fill="url(#fillDesktop)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid w-full gap-2">
            <div className="flex flex-col items-center gap-2 leading-none font-medium">
              <div className="flex gap-2">
                <Button className="text-primary hover:text-primary/80 w-16 border bg-transparent hover:bg-white/3">
                  1W
                </Button>
                <Button className="text-primary hover:text-primary/80 w-16 border bg-transparent hover:bg-white/3">
                  1M
                </Button>
                <Button className="text-primary hover:text-primary/80 w-16 border bg-transparent hover:bg-white/3">
                  3M
                </Button>
                <Button className="text-primary hover:text-primary/80 w-16 border bg-transparent hover:bg-white/3">
                  6M
                </Button>
                <Button className="text-primary hover:text-primary/80 w-16 border bg-transparent hover:bg-white/3">
                  YTD
                </Button>
                <Button className="text-primary hover:text-primary/80 w-16 border bg-transparent hover:bg-white/3">
                  1Y
                </Button>
              </div>
              <Button className="text-primary hover:text-primary/80 w-full border bg-transparent hover:bg-white/3">
                Add Account
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
