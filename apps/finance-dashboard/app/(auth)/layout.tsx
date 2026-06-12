import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {APP_NAME.charAt(0)}
            </div>
            <span className="font-semibold text-lg">{APP_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">Personal finance dashboard</p>
        </div>
        {children}
      </div>
    </div>
  );
}
