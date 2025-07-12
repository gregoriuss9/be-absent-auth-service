import { Router } from "express";
import {
  login,
  changeUsernameAndPassword,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.put("/change-credential", authenticate, changeUsernameAndPassword);

export default router;
