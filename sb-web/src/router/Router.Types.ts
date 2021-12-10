type PublicRoutesLabel = 'Landing' | 'Login' | 'Redirect';
type PrivateRoutesLabel = 'Error' | 'Boats' | 'Create' | 'Invite';
type WhitelistedRoutesLabel = 'AboutUs' | 'Contact' | 'FAQ' | 'HowItWorks' | 'Privacy' | 'Terms' | 'License';

interface Route {
    Public: Record<PublicRoutesLabel, string>;
    Private: Record<PrivateRoutesLabel, string>;
    Whitelisted: Record<WhitelistedRoutesLabel, string>;
}

export const Routes: Route = {
    Public: {
        Landing: '/',
        Login: '/login',
        Redirect: '/redirect',
    },
    Private: {
        Error: '/error',
        Boats: '/boats',
        Create: '/create',
        Invite: '/boats/:boatId/invite',
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
