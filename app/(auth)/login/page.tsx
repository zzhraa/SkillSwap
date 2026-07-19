"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground">
        S
      </span>
      <span className="text-lg font-semibold text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: LoginFormErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email wajib diisi";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Format email tidak valid";
    }
    if (!password.trim()) {
      nextErrors.password = "Password wajib diisi";
    } else if (password.length < 6) {
      nextErrors.password = "Password minimal 6 karakter";
    }
  
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      let role: "admin" | "user" = "user";

      // akun admin dummy
      if (email === "admin@skillswap.com") {
        role = "admin";
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <Logo />

        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="mb-6 space-y-1 text-center">
              <h1 className="text-2xl font-semibold text-foreground">
                Selamat Datang Kembali
              </h1>
              <p className="text-sm text-muted-foreground">
                Masuk untuk melanjutkan aktivitas belajarmu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {errors.form && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-2xs text-destructive">
                  {errors.form}
                </p>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@kampus.ac.id"
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-2xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link
                    href="#"
                    className="text-2xs font-medium text-primary hover:underline"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password"
                    className="pl-9 pr-9"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Tampilkan password"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-2xs text-destructive">{errors.password}</p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground/80">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className={cn(
                    "h-4 w-4 rounded border-border accent-[#534AB7]",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  )}
                />
                Ingat saya di perangkat ini
              </label>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}