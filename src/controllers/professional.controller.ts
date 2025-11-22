import { Request, Response } from "express";
import { Op, literal } from "sequelize";
import { ProfessionalModel } from "../models/Professional";
import { UserModel } from "../models/User";
import { AddressModel } from "../models/Address";
import { ServiceModel } from "../models/Service";
import { AppointmentModel } from "../models/Appointment";
import { ClientModel } from "../models/Client";
import { ProfessionalGalleryModel } from "../models/ProfessionalGallery";
import { ProfessionalAvailabilityModel } from "../models/ProfessionalAvailability";
import { AmenitiesModel } from "../models/Amenities";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { termo, page = 0, limit = 12, lat, lng } = req.query;
    const latNum = typeof lat === "string" ? parseFloat(lat) : undefined;
    const lngNum = typeof lng === "string" ? parseFloat(lng) : undefined;
    const hasLatLng = Number.isFinite(latNum) && Number.isFinite(lngNum);

    const where: any = {};
    if (termo) {
      where[Op.or] = [
        { "$User.name$": { [Op.like]: `%${termo}%` } },
        { "$User.email$": { [Op.like]: `%${termo}%` } },
        { cpf: { [Op.like]: `%${termo}%` } },
      ];
    }

    const distanceLiteral = hasLatLng
      ? literal(`
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${latNum})) * cos(radians("MainAddress"."lat")) *
            cos(radians("MainAddress"."lng") - radians(${lngNum})) +
            sin(radians(${latNum})) * sin(radians("MainAddress"."lat"))
          ))
        )
      `)
      : null;

    const order: any[] = [];
    if (hasLatLng && distanceLiteral) {
      order.push([distanceLiteral, "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    const attributes: any = {};

    if (hasLatLng && distanceLiteral) {
      attributes.include = [[distanceLiteral as any, "distance_km"]];
    }

    const { rows, count } = await ProfessionalModel.findAndCountAll({
      attributes,
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
          required: false,
        },
        {
          model: AddressModel,
          as: "MainAddress",
          attributes: ["lat", "lng", "city"],
          required: false,
        },
        {
          model: ServiceModel,
          as: "Services",
          required: false,
        },
        // {
        //   model: ProfessionalGalleryModel,
        //   as: "Gallery",
        //   required: false,
        // },
        // {
        //   model: ProfessionalAvailabilityModel,
        //   as: "Availabilities",
        //   required: false,
        // },
        // {
        //   model: AmenitiesModel,
        //   as: "Amenities",
        //   through: { attributes: [] },
        //   required: false,
        // },
        // Inclui appointments apenas com rating válido para calcular média/contagem
        {
          model: AppointmentModel,
          as: "Appointments",
          attributes: ["rating"],
          required: false,
          separate: true,
          where: {
            status: "completed",
            rating: { [Op.ne]: null } as any,
          },
        },
      ],
      where,
      order,
      limit: Number(limit),
      offset: Number(page) * Number(limit),
      distinct: true,
    });

    // Calcula ratings_avg e ratings_count a partir dos appointments incluídos
    for (const prof of rows as any[]) {
      const apps = (prof.Appointments ?? []) as Array<{
        rating: number | null;
      }>;
      const ratings = apps
        .map((a) => a?.rating ?? null)
        .filter((v): v is number => v !== null && Number.isFinite(v));

      const ratings_count = ratings.length;
      const rating =
        ratings_count > 0
          ? ratings.reduce((s, n) => s + n, 0) / ratings_count
          : null;

      // Arredonda para 2 casas decimais (mantendo tipo number)
      const roundedRating =
        rating !== null ? Math.round(rating * 100) / 100 : null;

      prof.setDataValue("rating", roundedRating); // média arredondada
      prof.setDataValue("ratings_count", ratings_count);

      // remove o array de appointments do payload
      if (prof.dataValues?.Appointments) {
        delete prof.dataValues.Appointments;
      }
    }

    return res.json({
      professionals: rows,
      totalCount: count,
      currentPage: Number(page),
      pageSize: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    return res.status(500).json({
      error: "Erro ao buscar profissionais",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getProfessionalById = async (req: Request, res: Response) => {
  try {
    const professional = await ProfessionalModel.findByPk(req.params.id, {
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
        },
        { model: AddressModel, as: "MainAddress" },
        { model: ServiceModel, as: "Services" },
        // { model: AmenitiesModel, as: "Amenities", through: { attributes: [] } },
        // { model: ProfessionalGalleryModel, as: "Gallery" },
        // {
        //   model: ProfessionalAvailabilityModel,
        //   as: "Availabilities",
        //   where: { is_available: true },
        // },
        {
          model: AppointmentModel,
          as: "Appointments",
          where: { status: "completed", rating: { [Op.not]: null } },
          required: false,
          include: [
            {
              model: ClientModel,
              as: "Client",
              include: [
                {
                  model: UserModel,
                  as: "User",
                  attributes: ["name", "avatar_uri"],
                },
              ],
            },
            {
              model: ServiceModel,
              as: "Service",
              attributes: ["title"],
            },
          ],
        },
      ],
    });

    if (!professional) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    // Calcular rating e ratings_count a partir dos appointments
    const profData: any = professional;
    const appointments = (profData.Appointments ?? []) as Array<{
      rating: number | null;
    }>;

    const ratings = appointments
      .map((a) => a?.rating ?? null)
      .filter((v): v is number => v !== null && Number.isFinite(v));

    const ratings_count = ratings.length;
    const rating =
      ratings_count > 0
        ? Math.round((ratings.reduce((s, n) => s + n, 0) / ratings_count) * 100) / 100
        : null;

    // Adicionar campos calculados
    profData.setDataValue("rating", rating);
    profData.setDataValue("ratings_count", ratings_count);

    return res.json(professional);
  } catch (error) {
    console.error("Erro ao buscar profissional:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

async function getAvailableSlots(
  professionalId: number,
  date: string,
  serviceDuration: number
) {
  const targetDate = new Date(`${date}T12:00:00.000Z`);
  const dayOfWeek = targetDate.getUTCDay();
  const bitmaskDay = "_".repeat(dayOfWeek) + "1" + "_".repeat(6 - dayOfWeek);

  const availabilityRules = await ProfessionalAvailabilityModel.findAll({
    where: {
      professional_id: professionalId,
      is_available: true,
      [Op.or]: [
        {
          recurrence_pattern: "weekly",
          days_of_week: { [Op.like]: `%${bitmaskDay}%` },
        },
        {
          recurrence_pattern: "none",
          start_day: { [Op.lte]: targetDate },
          end_day: { [Op.gte]: targetDate },
        },
      ],
    },
  });

  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const appointments = await AppointmentModel.findAll({
    where: {
      professional_id: professionalId,
      status: { [Op.in]: ["confirmed", "pending"] },
      start_time: { [Op.between]: [startOfDay, endOfDay] },
    },
  });

  const blocks = await ProfessionalAvailabilityModel.findAll({
    where: {
      professional_id: professionalId,
      is_available: false,
      recurrence_pattern: "none",
      start_day: { [Op.lte]: targetDate },
      end_day: { [Op.gte]: targetDate },
    },
  });

  const allBlockages = [
    ...appointments.map((a) => ({
      start: new Date(a.start_time),
      end: new Date(a.end_time),
    })),
    ...blocks.map((b) => {
      const [startH, startM] = b.start_time.split(":").map(Number);
      const [endH, endM] = b.end_time.split(":").map(Number);
      const blockStart = new Date(startOfDay);
      blockStart.setUTCHours(startH, startM);
      const blockEnd = new Date(startOfDay);
      blockEnd.setUTCHours(endH, endM);
      return { start: blockStart, end: blockEnd };
    }),
  ];

  const availableSlots: string[] = [];
  const slotInterval = 30;

  for (const rule of availabilityRules) {
    const [startH, startM] = rule.start_time.split(":").map(Number);
    const [endH, endM] = rule.end_time.split(":").map(Number);

    const ruleStart = new Date(startOfDay);
    ruleStart.setUTCHours(startH, startM, 0, 0);
    const ruleEnd = new Date(startOfDay);
    ruleEnd.setUTCHours(endH, endM, 0, 0);

    let currentSlotStart = new Date(ruleStart);

    while (currentSlotStart < ruleEnd) {
      const slotEnd = new Date(
        currentSlotStart.getTime() + serviceDuration * 60000
      );

      if (slotEnd > ruleEnd) {
        break;
      }

      const isBlocked = allBlockages.some((block) => {
        return currentSlotStart < block.end && slotEnd > block.start;
      });

      if (!isBlocked) {
        availableSlots.push(
          currentSlotStart.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          })
        );
      }
      currentSlotStart.setMinutes(currentSlotStart.getMinutes() + slotInterval);
    }
  }
  return [...new Set(availableSlots)].sort();
}

export const searchProfessionalAvailability = async (
  req: Request,
  res: Response
) => {
  const { subCategoryId, date, lat, lng } = req.query;

  if (!subCategoryId || !date) {
    return res
      .status(400)
      .json({ error: "subCategoryId e date são obrigatórios." });
  }
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res
      .status(400)
      .json({ error: "Formato de data inválido. Use AAAA-MM-DD." });
  }

  const latNum = typeof lat === "string" ? parseFloat(lat) : undefined;
  const lngNum = typeof lng === "string" ? parseFloat(lng) : undefined;
  const hasLatLng = Number.isFinite(latNum) && Number.isFinite(lngNum);

  try {
    const professionals = await ProfessionalModel.findAll({
      include: [
        {
          model: ServiceModel,
          as: "Services",
          where: { subcategory_id: Number(subCategoryId), active: true },
          required: true, // INNER JOIN para garantir que só venham profissionais da subcategoria
        },
        { model: UserModel, as: "User", attributes: ["name", "avatar_uri"] },
        {
          model: AddressModel,
          as: "MainAddress",
          attributes: ["city", "state", "lat", "lng"],
        },
      ],
    });
    if (!professionals.length) {
      return res.json([]);
    }

    const getDistance = (profLat: number, profLng: number) => {
      if (!hasLatLng) return 0;
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371; // Raio da Terra em km

      const dLat = toRad(profLat - latNum!);
      const dLon = toRad(profLng - lngNum!);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(latNum!)) *
          Math.cos(toRad(profLat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const resultsPromises = professionals.map(async (prof: any) => {
      const relevantService = prof.Services.find(
        (s: any) => s.subcategory_id === Number(subCategoryId)
      );
      const serviceDuration = relevantService?.duration || 60;
      const availableTimes = await getAvailableSlots(
        prof.id,
        date as string,
        serviceDuration
      );

      if (availableTimes.length === 0) {
        return null;
      }

      type ProfWithAppointments = ProfessionalModel & {
        Appointments?: { rating: number | null }[];
      };

      const professionalWithAppointments = (await ProfessionalModel.findByPk(
        prof.id,
        {
          include: [
            {
              model: AppointmentModel,
              as: "Appointments",
              where: { status: "completed", rating: { [Op.not]: null } },
              attributes: ["rating"],
              required: false,
            },
          ],
        }
      )) as ProfWithAppointments | null;

      const ratings =
        professionalWithAppointments?.Appointments?.map((a) => a.rating) || [];
      const ratingsCount = ratings.length;
      const averageRating =
        ratingsCount > 0
          ? ratings.reduce(
              (acc: number, val: number | null | undefined) => acc + (val || 0),
              0
            ) / ratingsCount
          : 0;
      const distance = prof.MainAddress
        ? getDistance(
            parseFloat(prof.MainAddress.lat),
            parseFloat(prof.MainAddress.lng)
          )
        : 0;
      return {
        id: prof.id,
        name: prof.User.name,
        imageUrl: prof.User.avatar_uri,
        serviceName: relevantService.title,
        priceFrom: relevantService.price,
        serviceId: relevantService.id,
        rating: parseFloat(averageRating.toFixed(1)),
        ratingsCount: ratingsCount,
        distance: parseFloat(distance.toFixed(1)),
        location: `${prof.MainAddress?.city}, ${prof.MainAddress?.state}`,
        offeredServices: prof.Services.map((s: any) => s.title),
        availableTimes: availableTimes,
      };
    });

    let results = (await Promise.all(resultsPromises)).filter(
      (result) => result !== null
    ) as any[];

    if (hasLatLng) {
      results.sort((a, b) => a.distance - b.distance);
    }

    return res.json(results);
  } catch (error: any) {
    console.error("Erro ao buscar disponibilidade:", error);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", details: error.message });
  }
};
