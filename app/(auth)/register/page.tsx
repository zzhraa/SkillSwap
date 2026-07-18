"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

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

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return score;
}

const strengthLabels = ["Sangat Lemah", "Lemah", "Cukup", "Kuat"];
const strengthColors = [
  "bg-destructive",
  "bg-warning",
  "bg-warning",
  "bg-success",
];

function PasswordStrengthMeter({ password }: { password: string }) {
  const score = getPasswordStrength(password);
  const activeIndex = Math.max(score - 1, 0);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "h-1 rounded-full bg-border",
              index <= activeIndex && score > 0 && strengthColors[activeIndex]
            )}
          />
        ))}
      </div>
      <p className="text-2xs text-muted-foreground">
        Kekuatan password: {strengthLabels[activeIndex]}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordScore = useMemo(() => getPasswordStrength(password), [password]);

  function validate(): boolean {
    const nextErrors: RegisterFormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Nama lengkap wajib diisi";
    }

    if (!email.trim()) {
      nextErrors.email = "Email wajib diisi";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Format email tidak valid";
    }

    if (!password.trim()) {
      nextErrors.password = "Password wajib diisi";
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      nextErrors.password = `Password minimum ${PASSWORD_MIN_LENGTH} karakter`;
    } else if (passwordScore < 2) {
      nextErrors.password =
        "Gunakan kombinasi huruf besar, huruf kecil, dan angka";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    if (!agreedToTerms) {
      nextErrors.terms = "Kamu harus menyetujui Syarat & Ketentuan";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // integrate with Supabase Auth sign-up
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/dashboard");
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
                Buat Akun Baru
              </h1>
              <p className="text-sm text-muted-foreground">
                Mulai belajar dan berbagi skill bersama mahasiswa lain
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {errors.form && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-2xs text-destructive">
                  {errors.form}
                </p>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="register-name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nama lengkap kamu"
                    className="pl-9"
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-2xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-email"
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
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 karakter"
                    className="pl-9 pr-9"
                    autoComplete="new-password"
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
                <PasswordStrengthMeter password={password} />
                {errors.password && (
                  <p className="text-2xs text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-confirm-password">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Ulangi password"
                    className="pl-9 pr-9"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-2xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="flex items-start gap-2 text-sm text-foreground/80">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(event) => setAgreedToTerms(event.target.checked)}
                    className={cn(
                      "mt-0.5 h-4 w-4 rounded border-border accent-[#534AB7]",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    )}
                  />
                  <span>
                    Saya menyetujui{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Syarat & Ketentuan
                    </Link>{" "}
                    serta{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-2xs text-destructive">{errors.terms}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}