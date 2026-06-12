import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EnrollForm } from "./enroll-form";

export default function MfaEnrollPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up MFA</CardTitle>
        <CardDescription>
          Required. Use Google Authenticator, 1Password or Authy to scan the QR code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnrollForm />
      </CardContent>
    </Card>
  );
}
