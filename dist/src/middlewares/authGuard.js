import { auth } from "../lib/auth";
export var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["SELLER"] = "SELLER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const authGuard = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers,
            });
            console.log("Session Data Today:", session);
            if (!session) {
                return res
                    .status(401)
                    .json({ message: "You are not authorized, please log in." });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role,
                emailVerified: session.user.emailVerified,
            };
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "You do not have permission to access this resource.",
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default authGuard;
//# sourceMappingURL=authGuard.js.map