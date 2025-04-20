const HasherHelper = require("../helpers/Hasher.helper");
const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { UserService } = require("../services/user.service");
const createQueryHelper = require("../helpers/Query.helper");
const { User } = require("../models/Users.modal");

class UserController {
  createNewUser = async (req, res) => {
    const { email, name, password, avatar, isGithub } = req.body;

    if (!email) {
      throw new HttpError(400, "Email is required");
    }

    let user = await UserService.findOne({ email });

    // If user exists, handle accordingly
    if (user) {
      if (isGithub) {
        // proceed with GitHub login
        const { generateToken } = user.schema.methods;

        const accessToken = generateToken({
          _id: user._id,
          email: user.email,
          role: user.role,
        });

        const userData = {
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
        };

        return Response(res)
          .status(200)
          .body({ accessToken, user: userData })
          .send();
      } else {
        throw new HttpError(401, "User Already Exists");
      }
    }

    // If user does not exist, create one
    let newUserPayload = {
      email,
      name,
      role: "User",
    };

    if (isGithub) {
      newUserPayload.avatar = avatar;
      newUserPayload.password = null;
      newUserPayload.authProvider = "github";
    } else {
      const salt = await HasherHelper.getSalt(10);
      const hash = await HasherHelper.hash(password, salt);
      newUserPayload.password = hash;
    }

    user = await UserService.create(newUserPayload);
    const { generateToken } = user.schema.methods;

    const accessToken = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    const userData = {
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    console.log(accessToken);
    Response(res).status(201).body({ accessToken, user: userData }).send();
  };

  loginViaPassword = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserService.findOne({ email });

    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    const { generateToken } = user.schema.methods;

    const isVerify = await HasherHelper.compare(password, user.password);
    if (!isVerify) throw new HttpError(401, "Incorrect Password");

    const accessToken = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    const userData = {
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      name: user.name,
    };
    Response(res)
      .status(201)
      .body({
        accessToken,
        user: userData,
      })
      .send();
  };
  editCurrentUser = async (req, res) => {
    if (req.body.password) {
      const salt = await HasherHelper.getSalt(10);

      const hash = await HasherHelper.hash(req.body.password, salt);

      req.body.password = hash;
    }

    const user = await UserService.findByIdAndUpdate(req.user._id, {
      ...req.body,
    });

    if (!user) throw new HttpError(409, "User doesn't Exists!");

    Response(res).status(201).message("Successfully Updated!").send();
  };
  createAdminUser = async (req, res) => {
    await UserService.create({ ...req.body, role: "Admin" });
    Response(res).status(201).message("Successfully Created").send();
  };
  getCurrentUser = async (req, res, next) => {
    try {
      console.log(req.user)
      const user = await UserService.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
        _id: user._id,
      };

      Response(res).body(userData).send();
    } catch (error) {
      console.error("Error fetching current user:", error);
      next(error); // You can use a global error handler or send manually
    }
  };

  getAllUsers = async (req, res) => {
    const { filter, options } = createQueryHelper(req.query, {
      searchFields: ["name"],
      unFilter: [],
      customFilters: (filter, query) => {
        // if (req.user.role === "ADMIN")
        filter._id = { $nin: [req.user._id] };
      },
      customPopulate: [{}],
    });
    const user = await UserService.paginate(filter, options);
    Response(res).body(user).send();
  };

  getUserDetails = async (req, res) => {
    const { userId } = req.params;
    const user = await UserService.findById(userId);
    if (!user) throw new HttpError(400, "No User Exists!");

    Response(res).body(user).send();
  };
}

module.exports.UserController = new UserController();
