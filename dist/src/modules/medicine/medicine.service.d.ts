export declare const medicineService: {
    createMedicine: (payload: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        imageUrl?: string;
        categoryId: string;
        manufacturer?: string;
        type?: string;
    }, userId: string) => Promise<{
        category: {
            name: string;
            description: string | null;
            imageUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../../../generated/prisma/enums").MedicineStatus;
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        type: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        manufacturer: string | null;
        sellerId: string;
    }>;
    getAllMedicines: ({ search, category, minPrice, maxPrice, page, limit, skip, sortBy, sortOrder, }: {
        search?: string | undefined;
        category?: string | undefined;
        minPrice?: number | undefined;
        maxPrice?: number | undefined;
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
    }) => Promise<{
        data: ({
            category: {
                name: string;
                description: string | null;
                imageUrl: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            status: import("../../../generated/prisma/enums").MedicineStatus;
            name: string;
            description: string | null;
            imageUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            type: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            manufacturer: string | null;
            sellerId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMedicineById: (medicineId: string) => Promise<({
        category: {
            name: string;
            description: string | null;
            imageUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../../../generated/prisma/enums").MedicineStatus;
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        type: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        manufacturer: string | null;
        sellerId: string;
    }) | null>;
    deleteMedicine: (medicineId: string, userId: string) => Promise<void>;
    updateMedicine: (payload: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        imageUrl?: string;
        categoryId: string;
        manufacturer?: string;
        type?: string;
    }, userId: string, medicineId: string) => Promise<{
        category: {
            name: string;
            description: string | null;
            imageUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../../../generated/prisma/enums").MedicineStatus;
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        type: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        manufacturer: string | null;
        sellerId: string;
    }>;
    getAllMedicinesBySellerId: (sellerId: string) => Promise<({
        category: {
            name: string;
            description: string | null;
            imageUrl: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../../../generated/prisma/enums").MedicineStatus;
        name: string;
        description: string | null;
        imageUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        type: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        manufacturer: string | null;
        sellerId: string;
    })[]>;
};
//# sourceMappingURL=medicine.service.d.ts.map