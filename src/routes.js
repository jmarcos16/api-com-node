import { Router } from "express";
import UserController from "./controllers/UserController";
import UserAuth from "./middleware/UserAuth";

const router = Router();

router.post("/user", UserController.createUser);
router.post("/user/auth", UserController.UserAuth);

// Private Router

router.get("/user/:id", UserAuth, UserController.findOne);

export { router };
