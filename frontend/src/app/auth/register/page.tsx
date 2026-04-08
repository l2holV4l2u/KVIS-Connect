"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const schema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z
    .string()
    .email("Enter a valid email")
    .refine((v) => v.toLowerCase().endsWith("@kvis.ac.th"), {
      message: "Must be a @kvis.ac.th email address",
    }),
  password: z.string().min(6, "At least 6 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  path: ["confirm_password"],
  message: "Passwords do not match",
});

type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const { refetch } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      await refetch();
      toast({ title: "Welcome to KVIS Connect!" });
      router.push("/edit");
    } catch (err) {
      const msg = err instanceof AxiosError ? err.response?.data?.detail : "Registration failed";
      if (typeof msg === "string" && msg.toLowerCase().includes("email")) {
        setError("email", { message: msg });
      } else {
        toast({ title: msg ?? "Registration failed", variant: "destructive" });
      }
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
            <CardTitle>Join KVIS Connect</CardTitle>
            <CardDescription>For KVIS alumni with a @kvis.ac.th email</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => authApi.microsoftLogin()}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Register with Microsoft
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">or with email</span>
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>First Name *</Label>
                  <Input placeholder="John" {...register("first_name")} />
                  {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Last Name *</Label>
                  <Input placeholder="Doe" {...register("last_name")} />
                  {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Label>KVIS Email *</Label>
                <Input type="email" placeholder="you@kvis.ac.th" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <Label>Password *</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-1">
                <Label>Confirm Password *</Label>
                <Input type="password" {...register("confirm_password")} />
                {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already a member?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
