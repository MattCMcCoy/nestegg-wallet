import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export * from "./button";
export * from "./input";
export * from "./separator";
export * from "./sheet";
export * from "./skeleton";
export * from "./tooltip";
export * from "./sidebar";
