"use client";

import { User } from "lucide-react";
import { useAuth } from "@/components/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserMenuProps } from "@/types";

export function UserMenu({ userEmail, householdName }: UserMenuProps) {
  const { logout } = useAuth();
  const { authError } = useToast();

  const handleLogout = async () => {
    const error = await logout();
    if (error) {
      authError("Nie udało się wylogować. Spróbuj ponownie.");
    } else {
      // Redirect will be handled by the auth state change
      window.location.assign("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
          <span className="sr-only">Menu użytkownika</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userEmail}</p>
            {householdName && <p className="text-xs leading-none text-muted-foreground">{householdName}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
