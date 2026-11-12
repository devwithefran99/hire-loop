"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { normalizeRole } from "@/lib/auth-roles"

// Input er style ek jayga te rakhlam, pore ekhane theke sob input customize korte parba
const inputClass =
  "h-11 rounded-xl border-hl-border-default bg-hl-surface-input text-hl-text-primary placeholder:text-hl-text-tertiary"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Better Auth diye sign in (MongoDB te user check kore)
    const { data, error: signInError } = await authClient.signIn.email({
      email: email.trim(),
      password,
    })
    setLoading(false)

    if (signInError) {
      setError(signInError.message || "Invalid email or password.")
      return
    }

    // Role onujayi dashboard e pathai
    let role = data?.user?.role
    if (!role) {
      const { data: session } = await authClient.getSession()
      role = session?.user?.role
    }

    router.push(`/dashboard/${normalizeRole(role)}`)
    router.refresh()
  }

  async function handleGoogle() {
    setError("")
    setGoogleLoading(true)
    const { error: googleError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
    if (googleError) {
      setError(googleError.message || "Google sign in failed.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100svh-92px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-hl-border-subtle bg-hl-surface-1 p-6 shadow-xl sm:p-8">
        {/* Header */}
        <div className="mb-6 space-y-1.5 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-hl-text-primary">
            Welcome back
          </h1>
          <p className="text-sm text-hl-text-secondary">
            Sign in to continue to HireLoop.
          </p>
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="h-11 w-full gap-3 rounded-xl border-hl-border-default bg-hl-surface-2/50 font-medium text-hl-text-primary hover:bg-hl-surface-2"
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.86Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3a7.2 7.2 0 0 1-10.73-3.78H1.3v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.34 14.32a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4.04-3.08Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.3 6.6l4.04 3.1A7.2 7.2 0 0 1 12 4.75Z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-hl-border-subtle" />
          <span className="text-[11px] font-medium tracking-[0.16em] text-hl-text-tertiary uppercase">
            or with email
          </span>
          <span className="h-px flex-1 bg-hl-border-subtle" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-hl-text-secondary">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-hl-text-secondary">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-hl-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-0 right-0 flex size-11 items-center justify-center text-hl-text-tertiary hover:text-hl-text-primary"
              >
                {showPassword ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="h-11 w-full rounded-xl bg-hl-brand font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-hl-text-secondary">
          New to HireLoop?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-hl-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
