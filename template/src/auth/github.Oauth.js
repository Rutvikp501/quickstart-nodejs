import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import  User  from "../models/User.model.js";
import { generateToken } from "../config/jwt.config.js"; // your existing JWT helper


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
      async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;

        let existingUser = await User.findOne({ email });
        if (!existingUser) {
          // New user
          existingUser = await User.create({
            name: profile.displayName,
            email,
            githubId: profile.id,
            profilePhoto: photo ? [{ publicId: null, url: photo }] : [],
            role: "user",
            isAdmin: false,
          });
        } else if (!existingUser.githubId) {
          // Existing user without githubId → link account
          existingUser.githubId = profile.id;

          await existingUser.save();
        }

        // ✅ Generate JWT token
        const token = generateToken(existingUser);

        // Attach token for callback route
        return done(null, { user: existingUser, token });
      } catch (err) {
        console.error("  Error in github OAuth:", err);
        return done(err, null);
      }
    }
  
));


