export declare const auth: import("better-auth").Auth<{
    baseURL: string | undefined;
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
        requireEmailVerification: false;
        autoSignIn: false;
    };
    trustedOrigins: string[];
    user: {
        additionalFields: {
            role: {
                type: "string";
                required: false;
            };
            phone: {
                type: "string";
                required: false;
            };
            address: {
                type: "string";
                required: false;
            };
            status: {
                type: "string";
                defaultValue: string;
                required: false;
            };
        };
    };
    socialProviders: {
        google: {
            prompt: "select_account consent";
            accessType: "offline";
            clientId: string;
            clientSecret: string;
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map