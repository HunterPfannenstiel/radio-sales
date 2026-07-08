"use client"

import { AuthBrand } from "@/components/auth/AuthBrand"
import { SigninForm } from "./SigninForm"

export function SigninScreen() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-8 p-4"
      style={{ background: "var(--color-surface-page)" }}
    >
      <AuthBrand />
      <SigninForm />
    </div>
  )
}
