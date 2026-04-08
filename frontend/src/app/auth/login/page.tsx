"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch {
      toast({ title: "Invalid email or password", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <GraduationCap className="h-7 w-7" />
            KVIS Connect
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your alumni account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Microsoft OAuth */}
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => authApi.microsoftLogin()}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Continue with Microsoft
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">or</span>
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label>KVIS Email</Label>
                <Input type="email" placeholder="you@kvis.ac.th" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <Link href="/auth/forgot" className="text-xs text-primary hover:underline">Forgot?</Link>
                </div>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
