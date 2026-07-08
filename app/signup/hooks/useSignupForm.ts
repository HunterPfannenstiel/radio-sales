"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRequest } from "@/hooks/useRequest"

export function useSignupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [nameOrPinChanged, setNameOrPinChanged] = useState(false)
  const { execute, loading, error } = useRequest<{ repId: string; name: string }>()

  const canSubmit = name.trim().length > 0 && pin.length === 4 && !loading

  function handleNameChange(value: string) {
    setName(value)
    setNameOrPinChanged(true)
  }

  function handlePinChange(value: string) {
    setPin(value.replace(/\D/g, "").slice(0, 4))
    setNameOrPinChanged(true)
  }

  async function handleSubmit() {
    if (!canSubmit) return
    setNameOrPinChanged(false)

    const result = await execute(
      "/api/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), pin }),
      },
      { toastOnError: false }
    )

    if (result) {
      router.push("/goals")
    }
  }

  return {
    name,
    pin,
    loading,
    showError: nameOrPinChanged ? false : Boolean(error),
    canSubmit,
    handleNameChange,
    handlePinChange,
    handleSubmit,
  }
}
