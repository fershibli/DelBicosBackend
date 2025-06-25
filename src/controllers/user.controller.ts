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
      client: {
        id: client.id,
        cpf: client.cpf,
      },
      address: newAddress
        ? {
            lat: newAddress.lat,
            lng: newAddress.lng,
            city: newAddress.city,
            state: newAddress.state,
            country_iso: newAddress.country_iso,
          }
        : undefined,
    };

    jwt.sign(tokenPayload, secretKey, options, (err, token) => {
      if (err) {
        console.error(err);
        throw err;
      }

      res.status(200).json({
        message: "Registration successful. Login-in user.",
        token: token,
        user: {
          id: user.id,
          client_id: client.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          cpf: client.cpf,
          address: address || null,
        },
      });
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

    const client = await ClientModel.findOne({ where: { user_id: user.id } });

    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    const address = await AddressModel.findByPk(client.main_address_id);

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
      client: {
        id: client.id,
        cpf: client.cpf,
      },
      address: address
        ? {
            lat: address.lat,
            lng: address.lng,
            city: address.city,
            state: address.state,
            country_iso: address.country_iso,
          }
        : undefined,
    };

    jwt.sign(tokenPayload, secretKey, options, (err, token) => {
      if (err) {
        console.error(err);
        throw err;
      }

      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          client_id: client.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          cpf: client.cpf,
          address: address || null,
        },
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.findAll();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await UserModel.findByPk(req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await UserModel.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await UserModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "User deleted" })
    : res.status(404).json({ error: "User not found" });
};
