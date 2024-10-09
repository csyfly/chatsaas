import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'
 
let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en']
let defaultLocale = 'en'
 
match(languages, locales, defaultLocale) // -> 'en-US'

const isPublicRoute = createRouteMatcher(['/', '/en', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }

  const response = NextResponse.next()

  // 设置 CORS 头
  response.headers.set('Access-Control-Allow-Origin', '*') // 或者指定允许的域名
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}` 
      || pathname.startsWith(`/api/`) 
      || pathname === `/robots.txt` 
      || pathname === `/favicon.ico`
      || pathname.startsWith(`/sitemap`)
      || pathname.startsWith(`/sign`)
  )
 
  if (pathnameHasLocale) {
    return response;
  }
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
})
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  return 'en'
}
/*
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}` 
      || pathname.startsWith(`/api/`) 
      || pathname === `/robots.txt` 
      || pathname === `/favicon.ico`
      || pathname.startsWith(`/sitemap`)
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}*/

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};