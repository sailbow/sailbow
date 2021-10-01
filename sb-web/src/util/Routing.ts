interface Route {
    Public: Record<string, string>;
    Private: Record<string, string>;
}

export const Routes: Route = {
    Public: {
        Landing: '/',
    },
    Private: {
        Home: '/',
    },
};
