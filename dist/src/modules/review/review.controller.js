import { reviewService } from "./review.service";
const createCustomerReview = async (req, res) => {
    try {
        const user = req.user;
        console.log(user?.id);
        const payload = {
            medicineId: req.body.medicineId,
            rating: req.body.rating,
            comment: req.body.comment,
        };
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Basic validation
        if (!payload.medicineId || !payload.rating) {
            return res.status(400).json({
                success: false,
                message: "Medicine ID and rating are required",
            });
        }
        const result = await reviewService.createCustomerReview(user?.id, payload);
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Create review error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create review",
        });
    }
};
const getAllReviewsbyproductId = async (req, res) => {
    try {
        const medicineId = req.params.medicineId;
        const result = await reviewService.getAllReviewsbyproductId(medicineId);
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Get reviews error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch reviews",
        });
    }
};
export const reviewController = {
    createCustomerReview,
    getAllReviewsbyproductId,
};
//# sourceMappingURL=review.controller.js.map