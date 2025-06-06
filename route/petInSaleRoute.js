import express from "express";
import {
  addPetInSale,
  getPetInSale,
  getPetInSaleByEmail,
  getPetInSaleById,
  updatePetStatusToBuyed,
  updatePetInSale,
  deletePetInSale

} from "../controller/petInSaleController.js";

const router = express.Router();

router.post("/add-petinsale", addPetInSale);
router.get("/petinsales", getPetInSale);
router.get("/petinsale/:email", getPetInSaleByEmail);
router.get("/petinsale/id/:id", getPetInSaleById);
router.put("/petinsale/buyed/:id", updatePetStatusToBuyed);
router.put("/petinsale/update/:id", updatePetInSale);
router.delete("/petinsale/delete/:id", deletePetInSale);


export default router;
