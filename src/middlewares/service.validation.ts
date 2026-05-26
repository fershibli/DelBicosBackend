import { Request, Response, NextFunction } from "express";

export function validateCreateService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title, duration, price, subcategory_id } = req.body as any;

  if (!title || typeof title !== "string" || title.trim().length === 0)
    return res.status(400).json({ error: "title é obrigatório" });

  const durationNum = Number(duration);
  if (!duration || !Number.isInteger(durationNum) || durationNum <= 0)
    return res
      .status(400)
      .json({ error: "duration deve ser um inteiro maior que 0 (minutos)" });

  const { price_cents } = req.body as any;
  // aceitar price_cents (inteiro em centavos) OU price (decimal/string)
  if (price_cents === undefined || price_cents === null) {
    const priceNum = Number(price);
    if (
      price === undefined ||
      price === null ||
      isNaN(priceNum) ||
      priceNum < 0
    )
      return res
        .status(400)
        .json({ error: "price ou price_cents é obrigatório e deve ser >= 0" });
  } else {
    const pc = Number(price_cents);
    if (!Number.isInteger(pc) || pc < 0)
      return res
        .status(400)
        .json({ error: "price_cents deve ser um inteiro >= 0" });
  }

  if (
    !subcategory_id ||
    !Number.isInteger(Number(subcategory_id)) ||
    Number(subcategory_id) <= 0
  )
    return res.status(400).json({ error: "subcategory_id é obrigatório" });

  return next();
}

export function validateUpdateService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.body as any;

  if (
    Object.prototype.hasOwnProperty.call(body, "title") &&
    (typeof body.title !== "string" || body.title.trim().length === 0)
  )
    return res.status(400).json({ error: "title inválido" });

  if (Object.prototype.hasOwnProperty.call(body, "duration")) {
    const d = Number(body.duration);
    if (!Number.isInteger(d) || d <= 0)
      return res
        .status(400)
        .json({ error: "duration deve ser um inteiro maior que 0" });
  }

  if (Object.prototype.hasOwnProperty.call(body, "price")) {
    const p = Number(body.price);
    if (isNaN(p) || p < 0)
      return res.status(400).json({ error: "price deve ser um número >= 0" });
  }

  if (Object.prototype.hasOwnProperty.call(body, "price_cents")) {
    const pc = Number(body.price_cents);
    if (!Number.isInteger(pc) || pc < 0)
      return res
        .status(400)
        .json({ error: "price_cents deve ser um inteiro >= 0" });
  }

  return next();
}
