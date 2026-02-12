import { UserStatus } from "../../../generated/prisma/enums";
export declare const userService: {
    getAllUsers: () => Promise<{
        role: import("../../../generated/prisma/enums").UserRole | null;
        phone: string | null;
        status: UserStatus | null;
        name: string;
        id: string;
        email: string;
    }[]>;
    userStatusUpdate: (id: string, status: string) => Promise<{
        role: import("../../../generated/prisma/enums").UserRole | null;
        phone: string | null;
        address: string | null;
        status: UserStatus | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        image: string | null;
        emailVerified: boolean;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map