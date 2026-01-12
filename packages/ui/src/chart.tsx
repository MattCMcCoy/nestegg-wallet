"use client";

import type { TooltipProps } from "recharts";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { ResponsiveContainer } from "recharts";

import { cn } from ".";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement; // must be a single React element
  className?: string;
  config?: ChartConfig;
  height?: string | number; // optional fixed height
  aspect?: number; // optional aspect ratio fallback
}

function ChartContainer({
  children,
  className,
  height = 300, // default height
  aspect,
  ...props
}: ChartContainerProps) {
  const containerStyle: React.CSSProperties = {};

  if (typeof height === "number") {
    containerStyle.height = `${height}px`;
  } else if (typeof height === "string") {
    containerStyle.height = height;
  } else if (aspect) {
    containerStyle.aspectRatio = aspect;
  }

  return (
    <div
      className={cn("relative w-full", className)}
      style={containerStyle}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipContentProps extends TooltipProps<number, string> {
  formatter?: (value: number) => string;
  className?: string;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  formatter = (val) => `$${val.toLocaleString()}`,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={`bg-background border-border/50 grid gap-1.5 rounded-lg border p-2 text-xs shadow ${className ?? ""}`}
    >
      {/* Date at the top */}
      <div className="font-medium">
        {label &&
          new Date(label as string | number | Date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          )}
      </div>

      {/* Each line / account */}
      {payload.map((item) => (
        <div key={item.dataKey} className="flex justify-between">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-mono font-medium tabular-nums">
            {item.value !== undefined ? formatter(Number(item.value)) : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = String(nameKey ?? item.dataKey ?? "value");
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={String(item.value ?? item.dataKey ?? index)}
              className={cn(
                "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
