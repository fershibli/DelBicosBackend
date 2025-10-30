import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { AddressModel } from "../models/Address";
import { ITokenPayload } from "../interfaces/authentication.interface";

/**
 * Gera um token JWT e o payload do usuário para a resposta do frontend.
 * @param user - A instância do UserModel.
 * @param client - A instância do ClientModel.
 * @param address - A instância do AddressModel (pode ser null).
 */
export const generateTokenAndUserPayload = (
  user: UserModel,
  client: ClientModel,
  address: AddressModel | null
) => {
  const secretKey = process.env.SECRET_KEY || "secret";
  const expiresIn = process.env.EXPIRES_IN || "1h";
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

  const token = jwt.sign(tokenPayload, secretKey, options);

  const userPayload = {
    id: user.id,
    client_id: client.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    cpf: client.cpf,
    avatar_uri: user.avatar_uri,
    address: address || null,
  };

  return { token, user: userPayload, address: address || null };
};
