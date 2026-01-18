// middleware/auth.ts
// Schuetzt Routen basierend auf User-Rolle

export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();
    const role = user.value?.app_metadata?.role;

    // /dashboard - nur Admin
    if (to.path.startsWith('/dashboard')) {
        if (!user.value) {
            return navigateTo('/login');
        }
        if (role !== 'admin') {
            return navigateTo('/login?error=unauthorized');
        }
    }

    // /account (außer confirm) - nur eingeloggte User
    if (to.path.startsWith('/account') && !to.path.includes('/confirm')) {
        if (!user.value) {
            return navigateTo('/login');
        }
    }
});
