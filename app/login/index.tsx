"use client"

import { LoginBrand } from "./LoginBrand"
import { LoginForm } from "./LoginForm"

export function LoginScreen() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-8 p-4"
      style={{ background: "var(--color-surface-page)" }}
    >
      <LoginBrand />
      <LoginForm />
    </div>
  )
}
