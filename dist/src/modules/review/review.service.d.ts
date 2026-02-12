import { customerReviewType } from "./review.controller";
export declare const reviewService: {
    createCustomerReview: (userId: string, payload: customerReviewType) => Promise<{
        user: {
            name: string;
            id: string;
            image: string | null;
        };
        medicine: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number;
        comment: string | null;
        medicineId: string;
    }>;
    getAllReviewsbyproductId: (medicineId: string) => Promise<({
        user: {
            name: string;
            id: string;
            image: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number;
        comment: string | null;
        medicineId: string;
    })[]>;
};
//# sourceMappingURL=review.service.d.ts.map