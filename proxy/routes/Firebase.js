import dotenv from "dotenv";
dotenv.config();

import express from "express";
import admin from "firebase-admin";
import fs from "fs";

const router = express.Router();

const serviceAccount = JSON.parse(fs.readFileSync("./firebase/serviceAccountKeys.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// DELETE /firebase/{uid} -> delete user in firebase
router.delete("/:uid", async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /firebase/{uid}/email -> update user
router.put("/:uid/email", async (req, res) => {
  try {
    const { email } = req.body;
    await admin.auth().updateUser(req.params.uid, { email });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /firebase/{uid}/password -> update password
router.post("/:uid/password", async (req, res) => {
  try {
    await admin.auth().updateUser(req.params.uid, { password: req.body.password });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /firebase/{uid}/active -> block user
router.put("/:uid/active", async (req, res) => {
  try {
    const { isActive } = req.body;

    await admin.auth().updateUser(req.params.uid, { disabled: !isActive });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /firebase/{uid}/unblock -> unblock user
router.post("/:uid/unblock", async (req, res) => {
  try {
    await admin.auth().updateUser(req.params.uid, { disabled: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
