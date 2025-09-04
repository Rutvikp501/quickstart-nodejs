import express from "express";
import passport from "passport";

const router = express.Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback with JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // GoogleStrategy returns { user, token }
    const { user, token } = req.user;

    // Option 1: Redirect with token in query (useful for frontend apps)
    // res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);

    // Option 2: Return JSON (for API-only usage)
    res.json({ message: "Google Login successful", token, user });
  }
);

export default router;
