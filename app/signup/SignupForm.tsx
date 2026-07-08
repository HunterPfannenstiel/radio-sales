"use client"

import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSignupForm } from "./hooks/useSignupForm"

export function SignupForm() {
  const {
    name,
    pin,
    loading,
    showError,
    canSubmit,
    handleNameChange,
    handlePinChange,
    handleSubmit,
  } = useSignupForm()

  return (
    <form
      className="w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Pick a name and a 4-digit PIN. No email, no password — just remember this pair to
            sign back in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="signup-name">Name</FieldLabel>
              <Input
                id="signup-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-pin">PIN</FieldLabel>
              <Input
                id="signup-pin"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                autoComplete="off"
                className="text-center font-mono tracking-[0.5em]"
                style={{ fontSize: "var(--font-size-h3)" }}
              />
            </Field>
          </FieldGroup>
          {showError && (
            <Alert variant="destructive">
              <AlertDescription>
                Couldn&apos;t create your account. Try a different name or PIN.
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full h-10" disabled={!canSubmit}>
            {loading ? (
              <>
                <Spinner />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </CardContent>
        <CardFooter className="justify-center gap-1">
          <span
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-text-secondary)",
            }}
          >
            Already have an account?
          </span>
          <Button asChild variant="link" className="h-auto p-0" style={{ fontSize: "var(--font-size-small)" }}>
            <Link href="/signin">Sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
