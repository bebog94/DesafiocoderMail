import { Router } from "express";

import {  saveUserDocuments,findUserById, roleSwapper} from "../controllers/users.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

router.get("/:idUser", findUserById);

router.put('/premium/:idUser', roleSwapper)

router.post("/:idUser/documents",
upload.fields([
  { name: "dni", maxCount: 1 },
  { name: "address", maxCount: 1 },
  { name: "bank", maxCount: 1 },
]),
saveUserDocuments
);

export default router;