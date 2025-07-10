const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const Email = require("../utils/Email");
const catchAsync = require("../utils/catchAsync");

exports.signupController = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  user.password = undefined;

  const url = `${req.protocol}://${req.get("host")}/profile`;
  await new Email(user, url).sendWelcome();

  res.status(201).json({
    status: "success",
    message: "Signup has been complited successfully",
    data: {
      user,
    },
  });
});

exports.loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  user.password = undefined;

  res.status(200).json({
    status: "success",
    message: "You are logged in successfully",
    data: {
      user,
    },
  });
});

exports.forgotPasswordController = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Email is required!", 400));

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with that email address!", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get("host")}${
      process.env.BASE_URL
    }auth/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Password reset email sent, Check your inbox please.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, Try again later!",
        500
      )
    );
  }
});

exports.resetPasswordController = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  // 1) Get user based on token
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired!", 400));

  // 2) If token has not expired, if there is a user with that token, set the new password
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been updated successfully",
  });
});
