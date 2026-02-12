import { Request, Response } from "express";
export declare const medicineController: {
    createMedicine: (req: Request, res: Response) => Promise<void>;
    getAllMedicines: (req: Request, res: Response) => Promise<void>;
    getMedicineById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteMedicine: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateMedicine: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllMedicinesBySellerId: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=medicine.controller.d.ts.map