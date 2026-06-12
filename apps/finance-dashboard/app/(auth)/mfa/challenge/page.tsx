import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChallengeForm } from "./challenge-form";

export default function MfaChallengePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MFA verification</CardTitle>
        <CardDescription>Open your authenticator app and enter the code.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChallengeForm />
      </CardContent>
    </Card>
  );
}
