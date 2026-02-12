import { Request, Response } from "express";
export interface customerReviewType {
    medicineId: string;
    rating: number;
    comment?: string;
}
export declare const reviewController: {
    createCustomerReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllReviewsbyproductId: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=review.controller.d.ts.map