// middleware/auth.ts
// Schuetzt Routen basierend auf User-Rolle

export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();
    const role = user.value?.app_metadata?.role;

    // /dashboard - nur HR
    if (to.path.startsWith('/dashboard')) {
        if (!user.value) {
            return navigateTo('/account/login');
        }
        if (role !== 'hr') {
            return navigateTo('/account/login?error=unauthorized');
        }
    }

    // /account (außer login und confirm) - nur eingeloggte User
    if (to.path.startsWith('/account') && !to.path.includes('/login') && !to.path.includes('/confirm')) {
        if (!user.value) {
            return navigateTo('/account/login');
        }
    }
});
