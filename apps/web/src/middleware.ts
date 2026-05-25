import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware sem Clerk em modo dev.
// Todas as rotas passam livremente — auth é feita no backend.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
