const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Hasher = require("../helpers/Hasher.helper");
const mongoosePaginate = require("mongoose-paginate-v2");

const { JWT_SECRET, JWT_EMAIL_VERIFY_SECRET } = process.env;

const Schema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
    },
    authProvider: {
      type: String,
    },
    forkedHubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hub" }],
    createdAt: { type: Date, default: Date.now },
    //   otp: {
    //     email: {
    //       type: String,
    //     },
    //     phone: {
    //       type: String,
    //     },
    //   },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(mongoosePaginate);

Schema.pre("save", async function (next) {
  try {
    let user = this;

    // If password doesn't exist or hasn't changed, skip hashing
    if (!user.password || !user.isModified("password")) return next();

    const salt = await Hasher.getSalt(10);
    const hash = await Hasher.hash(user.password, salt);

    user.password = hash;
    next();
  } catch (err) {
    console.error("Pre-save hook error:", err.message);
    next(err);
  }
});

Schema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    Hasher.compare(candidatePassword, this.password)
      .then((isMatch) => resolve(isMatch))
      .catch((err) => reject(err));
  });
};

Schema.methods.generateToken = (data) => {
  return jwt.sign(
    { ...data },
    JWT_SECRET
    // JWT_EXPIRY
  );
};
Schema.methods.generateVerifyEmailToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    JWT_EMAIL_VERIFY_SECRET || "abcd"
  );
};

exports.User = mongoose.model("User", Schema);
