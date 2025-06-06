import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginHandler,
  logout,
} from "../controller/userController.js";


const router = express.Router();


router.post("/login", loginHandler);
router.delete("/logout", logout);

router.post("/register", createUser); 
router.get("/users",  getUsers);
router.get("/users/:id",  getUserById);
router.put("/edit-user/:id",  updateUser);
router.delete("/delete-user/:id",  deleteUser);

export default router;