import { Router } from "express";
import UserController from "./controllers/UserController";
import UserAuth from "./middleware/UserAuth";

const router = Router();

router.post("/user", UserController.createUser);
router.post("/user/auth", UserController.UserAuth);
router.get("/users", UserController.findAll);
router.put("/user/:id", UserController.updateUser);
// router.delete("/user/:id", UserController.deleteUser);

// Private Router

router.get("/user/:id", UserAuth, UserController.findOne);

export { router };
