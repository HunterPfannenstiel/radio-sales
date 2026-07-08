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
import { useSigninForm } from "./hooks/useSigninForm"

export function SigninForm() {
  const {
    name,
    pin,
    loading,
    showError,
    canSubmit,
    handleNameChange,
    handlePinChange,
    handleSubmit,
  } = useSigninForm()

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
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>Enter your name and PIN to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="signin-name">Name</FieldLabel>
              <Input
                id="signin-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="signin-pin">PIN</FieldLabel>
              <Input
                id="signin-pin"
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
                Couldn&apos;t sign you in. Check your name and PIN and try again.
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full h-10" disabled={!canSubmit}>
            {loading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              "Sign in"
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
            Don&apos;t have an account?
          </span>
          <Button asChild variant="link" className="h-auto p-0" style={{ fontSize: "var(--font-size-small)" }}>
            <Link href="/signup">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
