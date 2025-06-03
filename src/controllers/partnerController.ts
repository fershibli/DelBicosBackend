import { Request, Response } from 'express';
import Partner from '../models/Partner';
import Service from '../models/Service';

export async function getPartnerProfile(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const partner = await Partner.findByPk(id, {
      include: [Service],
    });

    if (!partner) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }

    return res.status(200).json(partner);
  } catch (err) {
    console.error('Erro ao buscar parceiro:', err);
    return res.status(500).json({
      error: 'Erro ao buscar parceiro',
      details: (err as Error).message || err,
    });
  }
}

export async function createPartnerWithServices(req: Request, res: Response) {
  const {
    nome,
    descricao,
    endereco,
    fotoPerfil,
    notaMedia,
    servicos,
  } = req.body;

  if (!nome || !descricao || !endereco || !servicos || !Array.isArray(servicos)) {
    return res.status(400).json({
      error: 'Dados incompletos ou inválidos',
    });
  }

  try {
    const partner = await Partner.create(
      {
        nome,
        descricao,
        endereco,
        fotoPerfil,
        notaMedia,
        Services: servicos,
      },
      {
        include: [Service],
      }
    );

    return res.status(201).json({
      message: 'Parceiro criado com sucesso',
      partner,
    });
  } catch (err) {
    console.error('Erro ao criar parceiro:', err);
    return res.status(500).json({
      error: 'Erro ao criar parceiro',
      details: (err as Error).message || err,
    });
  }
}
