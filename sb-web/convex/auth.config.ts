const config = {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ]
};

export default config;