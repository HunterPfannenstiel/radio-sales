import { type NextRequest } from 'next/server'

export function getClientTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getRequestTimezone(request: NextRequest): string {
  return request.headers.get('x-timezone') ?? 'UTC'
}
