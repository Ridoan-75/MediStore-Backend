import { OrderStatus } from "../../../generated/prisma/enums";
interface IOrderItem {
    medicineId: string;
    quantity: number;
}
export declare const orderService: {
    createOrder: (payload: {
        phone: string;
        shippingAddress: string;
        orderItems: IOrderItem[];
    }, userId: string) => Promise<({
        orderItems: ({
            seller: {
                name: string;
                id: string;
                email: string;
            };
            medicine: {
                name: string;
                imageUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            sellerId: string;
            medicineId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        phone: string | null;
        status: OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAddress: string;
    }) | null>;
    getUserOrders: (userId: string) => Promise<({
        orderItems: ({
            medicine: {
                name: string;
                imageUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            sellerId: string;
            medicineId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        phone: string | null;
        status: OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAddress: string;
    })[]>;
    getOrderById: (orderId: string, userId: string) => Promise<{
        orderItems: ({
            seller: {
                phone: string | null;
                name: string;
                id: string;
            };
            medicine: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            sellerId: string;
            medicineId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        phone: string | null;
        status: OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAddress: string;
    }>;
    getOrderBySellerId: (sellerId: string) => Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        orderItems: ({
            seller: {
                phone: string | null;
                name: string;
                id: string;
            };
            medicine: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            sellerId: string;
            medicineId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        phone: string | null;
        status: OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAddress: string;
    })[]>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{
        orderItems: ({
            medicine: {
                name: string;
                imageUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            sellerId: string;
            medicineId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        phone: string | null;
        status: OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAddress: string;
    }>;
    getAllOrders: () => Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        orderItems: ({
            seller: {
                phone: string | null;
                name: string;
                id: string;
            };
            medicine: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            sellerId: string;
            medicineId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        phone: string | null;
        status: OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAddress: string;
    })[]>;
    trackOrderStatus: (orderId: string, userId: string) => Promise<{
        status: OrderStatus;
        id: string;
        updatedAt: Date;
        userId: string;
    }>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map