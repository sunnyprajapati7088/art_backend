const express = require("express");
const router = express.Router();
const paintingController = require("../controllers/paintingController");


router.post("/add", paintingController.addPainting);


router.get("/getAll", paintingController.getAllPaintings);


router.get("/getById/:id", paintingController.getPaintingById);


router.put("/updateById/:id", paintingController.updatePainting);


router.delete("/deleteById/:id", paintingController.deletePainting);

module.exports = router;
