import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { ResponseUtil } from "../utils/responseUtil";
import { AuthenticationError, ValidationError } from "../utils/errorUtil";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user: any = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json(ResponseUtil.notFound(`User: ${username}`));
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        no_employee: user.no_employee,
        name: user.name,
        username: user.username,
        department: user.department,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    res.json(ResponseUtil.success({ token }));
  } catch (error) {
    console.error("Error on register:", error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json(ResponseUtil.error("Internal server error"));
  }
};

export const changeUsernameAndPassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user: any = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).json(ResponseUtil.notFound(`User: ${user}`));
    }

    const { newUsername, oldPassword, newPassword } = req.body;

    const existingUsername = await User.findOne({
      where: { username: newUsername, id: { [Op.ne]: req.user.id } },
    });
    if (existingUsername) {
      throw new ValidationError("Username already exists!");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      throw new ValidationError("Invalid old password!");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    user.username = newUsername;

    await user.save();

    res.json(
      ResponseUtil.success({ message: "Credentials changed successfully" })
    );
  } catch (error) {
    console.error("Error on updated password or username:", error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json(ResponseUtil.error("Internal server error"));
  }
};
