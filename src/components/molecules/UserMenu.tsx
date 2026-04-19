"use client";

import Link from "next/link";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();
  if (!user) return null;

  const meta = user.user_metadata as
    | { full_name?: string; name?: string; avatar_url?: string; picture?: string }
    | undefined;
  const fullName = meta?.full_name || meta?.name || user.email || "User";
  const avatarUrl = meta?.avatar_url || meta?.picture;
  const initials = fullName
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Avatar className="h-9 w-9">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col px-1.5 py-1.5">
          <span className="text-sm font-medium truncate">{fullName}</span>
          <span className="text-xs text-muted-foreground truncate">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <UserIcon className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin/policies" />}>
            <Shield className="mr-2 h-4 w-4" />
            Admin · Policies
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin/riders" />}>
            <Shield className="mr-2 h-4 w-4" />
            Admin · Riders
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          variant="destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
