"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useFetch } from "@/hooks/useFetch"
import { useRequest } from "@/hooks/useRequest"

export function IdentityBadge({ className }: { className?: string }) {
  const router = useRouter()
  const { data: currentRep } = useFetch<{ id: string; name: string }>("/api/auth/me")
  const { execute: logout } = useRequest()

  async function handleLogout() {
    await logout("/api/auth/logout", { method: "POST" })
    router.push("/signin")
  }

  if (!currentRep) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2.5 rounded-md transition-colors hover:bg-[var(--sidebar-accent)]",
            className
          )}
          style={{ padding: "8px 12px" }}
        >
          <Avatar size="sm">
            <AvatarFallback
              style={{
                background: "var(--color-accent-primary)",
                color: "var(--color-text-inverse)",
              }}
            >
              {currentRep.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span
            className="truncate"
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-body)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--sidebar-foreground)",
            }}
          >
            {currentRep.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
