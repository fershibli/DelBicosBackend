import { Request, Response } from "express";
import { UserModel, IUser } from "../models/User";
import { AddressModel, IAddress } from "../models/Address";
import { ClientModel, IClient } from "../models/Client";

export const signUpUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // receives from the request body name, email, phone, password, cpf and address, but address has the following properties: lat, lng, street, number, complement, neighborhood, city, state, country_iso, postal_code
  // first step: create user and save it to the database, store id in variable userId
  // second step: create address and save it to the database, store id in variable addressId
  // last step: create client with userId, addressId and cpf, save it to the database
  const { name, email, phone, password, cpf, address } = req.body as {
    name: string;
    email: string;
    phone: string;
    password: string;
    cpf: string;
    address: IAddress;
  };
  try {
    // Create user
    const user = await UserModel.create({
      name,
      email,
      phone,
      password,
    });

    // Create address
    const newAddress = await AddressModel.create({
      ...address,
      user_id: user.id, // Associate address with the user
    });

    // Create client
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
