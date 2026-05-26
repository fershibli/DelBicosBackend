import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { ServiceModel } from "../models/Service";
import { ProfessionalModel } from "../models/Professional";

async function findServiceWithOwnership(
  serviceId: number,
  userId: number,
  res: Response,
): Promise<InstanceType<typeof ServiceModel> | null> {
  const service = await ServiceModel.findByPk(serviceId);
  if (!service) {
    res.status(404).json({ error: "Serviço não encontrado" });
    return null;
  }
  const professional = await ProfessionalModel.findByPk(
    service.professional_id,
  );
  if (!professional || professional.user_id !== userId) {
    res.status(403).json({
      error: "Sem permissão para alterar serviços deste profissional",
    });
    return null;
  }
  return service;
}

// GET /api/professionals/:professionalId/services
export const listServices = async (req: Request, res: Response) => {
  try {
    const professionalId = Number(req.params.professionalId);
    if (!Number.isInteger(professionalId) || professionalId <= 0)
      return res.status(400).json({ error: "professionalId inválido" });

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const rows = await ServiceModel.findAll({
      where: { professional_id: professionalId, active: true },
      limit,
      offset,
      order: [["title", "ASC"]],
    });

    return res.json(rows);
  } catch (error: any) {
    console.error("Erro listServices:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// GET /api/services  (global list, optional ?professionalId=)
export const listAllServices = async (req: Request, res: Response) => {
  try {
    const professionalId = req.query.professionalId
      ? Number(req.query.professionalId)
      : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (
      professionalId &&
      Number.isInteger(professionalId) &&
      professionalId > 0
    ) {
      where.professional_id = professionalId;
    }

    const { count, rows } = await ServiceModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["title", "ASC"]],
    });

    return res.json({ total: count, page, limit, data: rows });
  } catch (error: any) {
    console.error("Erro listAllServices:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// GET /api/services/:id
export const getService = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "id inválido" });

    const service = await ServiceModel.findByPk(id);
    if (!service)
      return res.status(404).json({ error: "Serviço não encontrado" });

    return res.json(service);
  } catch (error: any) {
    console.error("Erro getService:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// POST /api/professionals/:professionalId/services
export const createService = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const professionalId = Number(req.params.professionalId);
    if (!req.user)
      return res.status(401).json({ error: "Usuário não autenticado" });
    if (!Number.isInteger(professionalId) || professionalId <= 0)
      return res.status(400).json({ error: "professionalId inválido" });

    const professional = await ProfessionalModel.findByPk(professionalId);
    if (!professional)
      return res.status(404).json({ error: "Profissional não encontrado" });
    if (professional.user_id !== req.user.id)
      return res.status(403).json({
        error: "Sem permissão para criar serviços neste profissional",
      });

    const {
      title,
      description,
      price,
      price_cents,
      duration,
      date,
      banner_uri,
      subcategory_id,
    } = req.body;

    // price_cents tem precedência; se não vier, converte price -> cents
    const finalPriceCents =
      price_cents !== undefined
        ? Number(price_cents)
        : price !== undefined
          ? Math.round(Number(price) * 100)
          : undefined;
    const finalPrice =
      finalPriceCents !== undefined ? finalPriceCents / 100 : Number(price);

    const created = await ServiceModel.create({
      title,
      description,
      price: finalPrice,
      price_cents: finalPriceCents,
      duration: Number(duration),
      date: date ? new Date(date) : undefined,
      banner_uri,
      active: true,
      subcategory_id: Number(subcategory_id),
      professional_id: professionalId,
    });

    return res.status(201).json(created);
  } catch (error: any) {
    console.error("Erro createService:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// PUT /api/services/:id
export const updateService = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    if (!req.user)
      return res.status(401).json({ error: "Usuário não autenticado" });
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "id inválido" });

    const service = await findServiceWithOwnership(id, req.user.id, res);
    if (!service) return;

    const updatable = [
      "title",
      "description",
      "price",
      "price_cents",
      "duration",
      "date",
      "banner_uri",
      "subcategory_id",
      "active",
    ] as const;
    for (const key of updatable) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        // @ts-ignore
        service[key] = req.body[key];
      }
    }

    // Sincronizar price <-> price_cents
    if (req.body.price_cents !== undefined) {
      service.price = Number(req.body.price_cents) / 100;
      service.price_cents = Number(req.body.price_cents);
    } else if (req.body.price !== undefined) {
      service.price_cents = Math.round(Number(req.body.price) * 100);
      service.price = Number(req.body.price);
    }

    await service.save();
    return res.json(service);
  } catch (error: any) {
    console.error("Erro updateService:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// DELETE /api/services/:id  (soft delete via active=false)
export const deleteService = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    if (!req.user)
      return res.status(401).json({ error: "Usuário não autenticado" });
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "id inválido" });

    const service = await findServiceWithOwnership(id, req.user.id, res);
    if (!service) return;

    service.active = false;
    await service.save();
    return res.status(204).send();
  } catch (error: any) {
    console.error("Erro deleteService:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
