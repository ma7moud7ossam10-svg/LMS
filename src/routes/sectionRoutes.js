const express = require("express");
const sectionController = require("../controllers/sectionController");

const router = express.Router();

router.post("/", sectionController.createSection);
router.get("/", sectionController.getSections);
router.get("/:id", sectionController.getSection);
router.put("/:id", sectionController.updateSection);
router.patch("/:id", sectionController.updateSection);
router.delete("/:id", sectionController.deleteSection);

module.exports = router;
