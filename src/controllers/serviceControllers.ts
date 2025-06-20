import { Request, Response } from 'express';
import { ServiceModel } from '../models/Service';
import { SubCategoryModel } from '../models/Subcategory';

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

    // Validação dos campos obrigatórios
    if (!title || !price || !duration || !subcategory_id) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando",
        required: ["title", "price", "duration", "subcategory_id"]
      });
    }

    // Verifica se a subcategoria existe
    const subcategoryExists = await SubCategoryModel.findByPk(subcategory_id);
    if (!subcategoryExists) {
      return res.status(404).json({
        error: "Subcategoria não encontrada",
        subcategory_id
      });
    }

    const newService = await ServiceModel.create({
      title,
      description: description || null,
      price: parseFloat(price),
      duration: parseInt(duration),
      active: active !== undefined ? active : true,
      subcategory_id
    });

    return res.status(201).json(newService);
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({
      error: "Erro ao criar serviço",
      details: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    });
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
