import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.rol !== 'administrador') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    
    if (req.nextUrl.pathname.startsWith('/geneticas')) {
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/checkout', '/geneticas/:path*']
}; 