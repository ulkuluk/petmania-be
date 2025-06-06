import express from "express";
import {
  addTransaction,
  getAllTransactions,
  getTransactionsByBuyer,
  updateTransactionStatus,
  getTransactionsByAnimalId
} from "../controller/transactionController.js";

const router = express.Router();

router.post("/add-transaction", addTransaction);
router.get("/transactions", getAllTransactions);
router.get("/transaction/:email", getTransactionsByBuyer);
router.put("/transaction/:id", updateTransactionStatus);
router.get("/transaction/animal/:animalId", getTransactionsByAnimalId);

export default router;
