import { Request, Response } from "express";
import { UserModel } from "../models/User";
import fs from "fs";
import path from "path";

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Base64 image is required" });
    }

    const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!base64Regex.test(base64Image)) {
      return res.status(400).json({ 
        error: "Invalid base64 format. Expected format: data:image/(png|jpg|jpeg);base64,..." 
      });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,/);
    if (!matches || matches.length < 2) {
      return res.status(400).json({ error: "Invalid base64 format" });
    }

    const imageType = matches[1];
    const base64Data = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    const avatarDir = path.join(__dirname, "..", "..", "avatarBucket", userId);
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    const fileName = `avatar.${imageType}`;
    const filePath = path.join(avatarDir, fileName);

    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    const relativePath = `avatarBucket/${userId}/${fileName}`;
    await user.update({ avatarUri: relativePath });

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatarUri: relativePath
    });

  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByPk(userId, {
      attributes: ["id", "avatarUri"]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.avatarUri) {
      return res.status(404).json({ error: "Avatar not found for this user" });
    }

    res.status(200).json({
      userId: user.id,
      avatarUri: user.avatarUri
    });

  } catch (error: any) {
    console.error("Error getting avatar:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.avatarUri) {
      return res.status(404).json({ error: "Avatar not found for this user" });
    }

    const filePath = path.join(__dirname, "..", "..", user.avatarUri);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const avatarDir = path.dirname(filePath);
    if (fs.existsSync(avatarDir)) {
      const files = fs.readdirSync(avatarDir);
      if (files.length === 0) {
        fs.rmdirSync(avatarDir);
      }
    }

    await user.update({ avatarUri: null } as any);

    res.status(200).json({ message: "Avatar deleted successfully" });

  } catch (error: any) {
    console.error("Error deleting avatar:", error);
    res.status(500).json({ error: error.message });
  }
};