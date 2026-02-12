import { Request, Response } from "express";
export declare const orderController: {
    createOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getUserOrders: (req: Request, res: Response) => Promise<void>;
    getOrderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getOrderBySellerId: (req: Request, res: Response) => Promise<void>;
    updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
    trackOrderStatus: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=order.controller.d.ts.map