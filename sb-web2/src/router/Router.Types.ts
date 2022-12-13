type PublicRoutesLabel = 'Login' | 'Redirect' | 'Authorize' | 'Auth' | 'Register' | 'ForgotPassword';
type PrivateRoutesLabel = 'Error' | 'Boats' | 'Invite';
type WhitelistedRoutesLabel = 'AboutUs' | 'Contact' | 'FAQ' | 'HowItWorks' | 'Privacy' | 'Terms' | 'License';

interface RouteStruct {
    base: string;
    children?: Record<string, RouteStruct>;
}

interface Route {
    Public: Record<PublicRoutesLabel, string>;
    Private: Record<PrivateRoutesLabel, RouteStruct>;
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
        Error: {
            base: '/error',
        },
        Boats: {
            base: '/boats',
            children: {
                BoatHome: {
                    base: '',
                },
                BoatView: {
                    base: '/:boatId',
                },
            },
        },
        Invite: {
            base: '/invite',
        },
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
export const BoatRoutes = {
    Base: Routes.Private.Boats.base,
    BoatHome: Routes.Private.Boats.children!.BoatHome.base,
    BoatView: Routes.Private.Boats.children!.BoatView.base,
};

const generatePrivateRoutes = () => {
    const allPrivateRoutes = Object.values(Routes.Private);
    const privateRouteSet = new Set<string>();

    allPrivateRoutes.forEach((route) => {
        const stack: [string, RouteStruct][] = [['', route]];

        while (stack.length) {
            const popped = stack.shift();

            if (popped) {
                const [baseRoute, poppedRoute] = popped;
                const currentBase = `${baseRoute}${poppedRoute.base}`;

                privateRouteSet.add(currentBase);

                let poppedChildren: RouteStruct[] = [];

                if (poppedRoute.children) {
                    poppedChildren = Object.values(poppedRoute.children);
                }

                for (const i of poppedChildren) {
                    stack.push([currentBase, i]);
                }
            }
        }
    });

    return Array.from(privateRouteSet);
};

export const PrivateRoutes: string[] = generatePrivateRoutes();
