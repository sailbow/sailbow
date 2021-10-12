interface Route {
    Public: Record<string, string>;
    Private: Record<string, string>;
    Whitelisted: Record<string, string>;
}

export const Routes: Route = {
    Public: {
        Landing: '/',
        Create: '/start-a-boat',
    },
    Private: {
        Home: '/',
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
