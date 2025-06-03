import { Request, Response } from 'express';
import Partner from '../models/Partner';
import Service from '../models/Service';

export async function getPartnerProfile(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const partner = await Partner.findByPk(id, {
      include: [
        { model: Service },
      ],
    });

    if (!partner) return res.status(404).json({ error: 'Parceiro não encontrado' });

    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar parceiro', details: err });
  }
}
