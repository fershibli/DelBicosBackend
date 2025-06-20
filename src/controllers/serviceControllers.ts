import { Request, Response } from 'express';
import { ServiceModel } from '../models/Service';

export async function getAllServices(req: Request, res: Response) {
  try {
    const services = await ServiceModel.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
}

export async function getServiceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const { title, description, price, duration, active, subcategory_id } = req.body;

    const newService = await ServiceModel.create({
      title,
      description,
      price,
      duration,
      active,
      subcategory_id
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, price, duration, active, subcategory_id } = req.body;

    const service = await ServiceModel.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    await service.update({
      title,
      description,
      price,
      duration,
      active,
      subcategory_id
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const service = await ServiceModel.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    await service.destroy();
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
}
