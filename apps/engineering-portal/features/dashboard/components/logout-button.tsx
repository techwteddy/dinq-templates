import { adminSignOut } from '@/lib/actions';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <form action={adminSignOut}>
      <button
        type="submit"
        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden group-data-[collapsible=icon]:hidden sm:inline">
          Sign Out
        </span>
      </button>
    </form>
  );
}
