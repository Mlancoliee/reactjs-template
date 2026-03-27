export function middleware(context) {
    const {request,rewrite} = context;
    const url = new URL(request.url);
    if (url.pathname === '/about') {
        return rewrite('/robots.txt');
    }
}