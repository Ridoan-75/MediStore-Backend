import { Response } from "express";

export const sendJSON = (
  success: boolean,
  res: Response,
  status: number,
  message?: string,
  data?: Object,
  pagination?: Object,
) => {
  return res.status(status).json({
    success,
    message,
    data,
    pagination,
  });
};
