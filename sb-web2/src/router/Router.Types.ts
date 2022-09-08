type PublicRoutesLabel = 'Landing' | 'Login' | 'Redirect' | 'Authorize';
type PrivateRoutesLabel = 'Error' | 'Boats' | 'Invite' | 'Boat';
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
        Authorize: '/authorize',
    },
    Private: {
        Error: '/error',
        Boats: '/boats',
        Invite: '/invite',
        Boat: '/boat/:boatId',
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
