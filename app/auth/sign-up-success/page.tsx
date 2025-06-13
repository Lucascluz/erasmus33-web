import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react"; // Example: using lucide-react icons

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4 md:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-bold">Almost there!</CardTitle>
          <CardDescription className="text-md pt-2 text-muted-foreground">
            We&apos;ve sent a confirmation link to your registered email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2 rounded-md border border-dashed border-primary/50 bg-primary/10 p-4 text-primary">
            <Mail className="h-6 w-6" />
            <p className="text-sm font-medium">Please check your email inbox now.</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the verification link in the email to activate your account. This
            will open in a new tab and log you in automatically.
          </p>
          <p className="text-xs text-muted-foreground/80">
            If you don&apos;t see the email within a few minutes, please check
            your spam or junk folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
