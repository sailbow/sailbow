interface Route {
    Public: Record<string, string>;
    Private: Record<string, string>;
    Whitelisted: Record<string, string>;
}

export const Routes: Route = {
    Public: {
        Landing: '/',
        Login: '/login',
    },
    Private: {
        Home: '/',
        Create: '/start-a-boat',
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
