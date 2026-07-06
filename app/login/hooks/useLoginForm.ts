"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRequest } from "@/hooks/useRequest"

export function useLoginForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [nameOrPinChanged, setNameOrPinChanged] = useState(false)
  const { execute, loading, error } = useRequest<{ repId: string; name: string; isNewRep: boolean }>()

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

    const result = await execute("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), pin }),
    })

    if (result) {
      router.push(result.isNewRep ? "/goals" : "/")
    }
  }

  return {
    name,
    pin,
    loading,
    error: nameOrPinChanged ? "" : error ?? "",
    canSubmit,
    handleNameChange,
    handlePinChange,
    handleSubmit,
  }
}
