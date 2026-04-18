const express = require( "express ");
const { auth } = require( "../middleware/auth ");
const router = express.Router();

// Simple in-memory settings with MongoDB persistence
const mongoose = require( "mongoose ");

const settingsSchema = new mongoose.Schema({
key: { type: String, required: true, unique: true },
value: mongoose.Schema.Types.Mixed
});
const Setting = mongoose.model( "Setting ", settingsSchema);

// Get all settings (public)
router.get( "/ ", async (req, res) => {
try {
const settings = await Setting.find({});
const result = {};
settings.forEach(s => result[s.key] = s.value);
// Never expose secret key to frontend
delete result.paystackSecretKey;
res.json(result);
} catch (e) {
res.json({
deliveryFee: 20,
pickupAddress:  "Contact us for pickup address ",
paystackKey: process.env.PAYSTACK_PUBLIC_KEY ||  " "
});
}
});

// Update settings (admin only)
router.put( "/ ", auth, async (req, res) => {
try {
if (!req.user.isAdmin) return res.status(403).json({ error:  "Forbidden " });
const updates = req.body;
for (const [key, value] of Object.entries(updates)) {
await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
}
res.json({ message:  "Settings updated " });
} catch (e) {
res.status(500).json({ error: e.message });
}
});

module.exports = router;