import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function EmergencyContact() {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-full bg-destructive/10 p-2 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <CardTitle className="text-destructive">Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          If you are experiencing a life-threatening emergency, please call 911
          immediately.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold">Campus Security</h4>
            <p className="text-sm text-muted-foreground">+1 (555) 999-0000</p>
          </div>
          <div>
            <h4 className="font-semibold">Crisis Hotline</h4>
            <p className="text-sm text-muted-foreground">+1 (555) 999-1111</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
