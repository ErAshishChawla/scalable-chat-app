import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { generateVerificationToken } from "../utils/user-methods";

import "dotenv/config";

const hashRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS!);
const jwtAccessSecret = process.env.JWT_ACCESS_TOKEN_SECRET!;
const jwtAccessExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY!;
const jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET!;
const jwtRefreshExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY!;

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },

    verificationToken: {
      type: String,
    },

    verificationTokenExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    methods: {
      isPasswordCorrect: async function (password: string) {
        return await bcrypt.compare(password, this.password);
      },
      generateAccessToken: function () {
        return jwt.sign(
          {
            _id: this._id,
            email: this.email,
            role: this.role,
          },
          jwtAccessSecret,
          {
            expiresIn: jwtAccessExpiry,
          }
        );
      },
      generateRefreshToken: function () {
        return jwt.sign(
          {
            _id: this._id,
          },
          jwtRefreshSecret,
          {
            expiresIn: jwtRefreshExpiry,
          }
        );
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, hashRounds);
  next();
});

userSchema.pre("save", async function (next) {
  const { verificationToken, verificationTokenExpiry } =
    generateVerificationToken();

  this.verificationToken = verificationToken;
  this.verificationTokenExpiry = verificationTokenExpiry;

  next();
});

export const User = mongoose.model("User", userSchema);
