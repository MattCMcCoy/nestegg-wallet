import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@acme/ui/card";
import { Button } from "@acme/ui/button";
import { Skeleton } from "@acme/ui";
import { Field, FieldLabel } from "@acme/ui/field";

export function AccountsLineChartSkeleton() {
  return (
    <Card className="flex h-[40vh] flex-col">
      <CardHeader>
        <CardDescription>Total Balance</CardDescription>
        <CardTitle className="text-2xl">
          <Skeleton className="h-8 w-32" />
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[35vh] w-full flex-1">
        <Skeleton className="h-full w-full" />
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid w-full gap-2">
            <div className="flex flex-col items-center gap-2 leading-none font-medium">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function AccountSectionSkeleton({
  title,
  count = 3,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div className="bg-background dark:border-border-dark dark:bg-background-dark space-y-6 rounded-lg border p-4">
      <h2 className="font-mono text-xs font-semibold">{title}</h2>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountsProgressSkeleton() {
  return (
    <div className="bg-background dark:border-border-dark dark:bg-background-dark mb-2 h-fit max-w-[30vw] flex-1 space-y-6 rounded-lg border p-4">
      <Skeleton className="h-5 w-16" />
      {Array.from({ length: 2 }).map((_, i) => (
        <Field key={i}>
          <FieldLabel>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-12" />
          </FieldLabel>
          <Skeleton className="h-3 w-full rounded" />
        </Field>
      ))}
      <Skeleton className="h-5 w-24" />
      {Array.from({ length: 2 }).map((_, i) => (
        <Field key={i}>
          <FieldLabel>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-12" />
          </FieldLabel>
          <Skeleton className="h-3 w-full rounded" />
        </Field>
      ))}
    </div>
  );
}

