import { loginAdminFormAction } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminLoginFormProps {
  error?: string;
}

export function AdminLoginForm({ error }: AdminLoginFormProps) {
  return (
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Enter the admin password to view survey responses.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={loginAdminFormAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
