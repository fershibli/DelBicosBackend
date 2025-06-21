import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserModel, IUser } from "../models/User";
import { AddressModel, IAddress } from "../models/Address";
import { ClientModel, IClient } from "../models/Client";
import { ITokenPayload } from "../interfaces/authentication.interface";

export const signUpUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, phone, password, cpf, address } = req.body as {
    name: string;
    email: string;
    phone: string;
    password: string;
    cpf: string;
    address: IAddress;
  };

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const newAddress = await AddressModel.create({
      ...address,
      user_id: user.id,
    });

    const client = await ClientModel.create({
      user_id: user.id,
      main_address_id: newAddress.id,
      cpf,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const logInUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const secretKey = process.env.SECRET_KEY || "secret";
    const expiresIn = process.env.EXPIRES_IN || "1h"; // Default to 1 hour if not set
    const options: jwt.SignOptions = {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    };

    const tokenPayload: ITokenPayload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };

    jwt.sign(tokenPayload, secretKey, options, (err, token) => {
      if (err) {
        console.error(err);
        throw err;
      }
      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
