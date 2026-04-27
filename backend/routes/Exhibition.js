const express    = require("express");
const router     = express.Router();
const multer     = require("multer");
const path       = require("path");
const fs         = require("fs");
const Exhibition = require("../models/Exhibition");
const { auth, adminOnly } = require("../middleware/auth");

const uploadDir = "uploads/exhibition/";
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, uploadDir); },
  filename:    function(req, file, cb){ cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const items = await Exhibition.find().sort({ createdAt: -1 });
    res.json(items);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post("/", auth, adminOnly, upload.single("media"), async (req, res) => {
  try {
    const type = req.file.mimetype.startsWith("video") ? "video" : "image";
    const item = await Exhibition.create({
      url:  "/uploads/exhibition/" + req.file.filename,
      type: type,
      name: req.file.originalname
    });
    res.json(item);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Exhibition.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;