type PublicRoutesLabel = 'Login' | 'Redirect' | 'Authorize' | 'Auth' | 'Register' | 'ForgotPassword';
type PrivateRoutesLabel = 'Error' | 'Boats' | 'Invite';
type WhitelistedRoutesLabel = 'AboutUs' | 'Contact' | 'FAQ' | 'HowItWorks' | 'Privacy' | 'Terms' | 'License';

interface Route {
    Public: Record<PublicRoutesLabel, string>;
    Private: Record<PrivateRoutesLabel, string>;
    Whitelisted: Record<WhitelistedRoutesLabel, string>;
}

export const Routes: Route = {
    Public: {
        Login: '/login',
        Redirect: '/redirect',
        Authorize: '/authorize',
        Register: '/register',
        Auth: '/',
        ForgotPassword: '/forgot-password',
    },
    Private: {
        Error: '/error',
        Boats: '/boats',
        Invite: '/invite',
    },
    Whitelisted: {
        AboutUs: '/about-us',
        Contact: '/contact',
        FAQ: '/faq',
        HowItWorks: '/how-it-works',
        Privacy: '/privacy',
        Terms: '/terms',
        License: '/license',
    },
};

export const WhitelistedRoutes: string[] = Object.values(Routes.Whitelisted);
export const PrivateRoutes: string[] = Object.values(Routes.Private);
