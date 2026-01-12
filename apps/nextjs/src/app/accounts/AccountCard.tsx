"use client";

import type { AccountViewModel } from "@nestegg/types";
import { Avatar, AvatarFallback, AvatarImage } from "@nestegg/ui/avatar";
import { useTheme } from "@nestegg/ui/theme";

export function AccountCard({ account }: { account: AccountViewModel }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="text-sm">{account.name}</div>
          <div className="my-auto h-1 w-1 rounded-full bg-black dark:bg-white"></div>
          <div className="text-sm">{account.mask ? `${account.mask}` : ""}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="my-auto h-1 w-1 rounded-full bg-green-500 dark:bg-green-400"></div>
          <div className="text-xs text-gray-400 italic">1 hour ago</div>
        </div>
      </div>
      <div className="mr-3 ml-auto">
        <p className="text-brand-primary-light text-sm">
          {account.balance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
    </div>
  );
}
