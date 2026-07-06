"use client"

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useLoginForm } from "./hooks/useLoginForm"

export function LoginForm() {
  const {
    name,
    pin,
    loading,
    error,
    canSubmit,
    handleNameChange,
    handlePinChange,
    handleSubmit,
  } = useLoginForm()

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
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login-name">Name</FieldLabel>
              <Input
                id="login-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-pin">PIN</FieldLabel>
              <Input
                id="login-pin"
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
        </CardContent>
        <CardFooter className="flex-col gap-2">
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
          {error && (
            <p
              className="text-center"
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-status-warning)",
              }}
            >
              {error}
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}
