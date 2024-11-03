import { Router } from "express";
import userRoutes from "./userRoutes";
import appointmentRoutes from "./appointmentRoutes";
import medicalRecordRoutes from "./medicalRecordRoutes";
import examinationResultRoutes from "./examinationResultRoutes";
import medicationRequestRoutes from "./medicationRequestRoutes";
import authorizationRoutes from "./authorizationRoutes";
import specialistRoutes from "./specialistRoutes";
import { authenticate } from "../middlewares/authenticate";
import medicationRoutes from "./medicationRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/appointments", authenticate, appointmentRoutes);
router.use("/medical-records", authenticate, medicalRecordRoutes);
router.use("/examination-results", authenticate, examinationResultRoutes);
router.use("/medication-requests", authenticate, medicationRequestRoutes);
router.use("/authorizations", authenticate, authorizationRoutes);
router.use("/specialists", specialistRoutes);
router.use("/medications", medicationRoutes); 

export default router;
