import { Request, Response } from "express";

export const handleSignout = (req: Request, res: Response) => {
  console.log("handleSignout");
  res.clearCookie("chatapp-access-token");
  res.clearCookie("chatapp-refresh-token");
  return res.status(200).json({ message: "Signout successful" });
};
