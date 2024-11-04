import { Router } from "express";
import { getAllMedications } from "../controllers/medicationController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/", authenticate, getAllMedications);

export default router;
