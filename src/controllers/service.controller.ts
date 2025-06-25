import { Request, Response } from 'express';
import { ServiceModel } from '../models/Service';
import { SubCategoryModel } from '../models/Subcategory';
import { ProfessionalModel } from '../models/Professional';

export async function getAllServices(req: Request, res: Response): Promise<Response> {
  try {
    const services = await ServiceModel.findAll();
    return res.json(services);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Erro ao buscar serviços', details: error.message });
    }
    return res.status(500).json({ error: 'Erro desconhecido ao buscar serviços' });
  }
}

export async function getServiceById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const service = await ServiceModel.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    return res.json(service);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Erro ao buscar serviço', details: error.message });
    }
    return res.status(500).json({ error: 'Erro desconhecido ao buscar serviço' });
  }
}

export async function createService(req: Request, res: Response): Promise<Response> {
  try {
    const { professional_id, subcategory_id } = req.body;
    
    if (!professional_id) {
      return res.status(400).json({ error: "professional_id é obrigatório" });
    }
    
    if (!subcategory_id) {
      return res.status(400).json({ error: "subcategory_id é obrigatório" });
    }

    const professional = await ProfessionalModel.findByPk(professional_id);
    if (!professional) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    const subcategory = await SubCategoryModel.findByPk(subcategory_id);
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategoria não encontrada" });
    }

    const service = await ServiceModel.create(req.body);
    return res.status(201).json(service);
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Erro ao criar serviço',
        message: error.message,
        details: error instanceof Error && 'errors' in error ? error.errors : undefined
      });
    }
    return res.status(500).json({ error: 'Erro desconhecido ao criar serviço' });
  }
}

export async function updateService(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { title, description, price, duration, active, subcategory_id, professional_id } = req.body;

    const service = await ServiceModel.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    if (professional_id) {
      const professional = await ProfessionalModel.findByPk(professional_id);
      if (!professional) {
        return res.status(404).json({ error: "Profissional não encontrado" });
      }
    }

    if (subcategory_id) {
      const subcategory = await SubCategoryModel.findByPk(subcategory_id);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategoria não encontrada" });
      }
    }

    await service.update(req.body);
    return res.json(service);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Erro ao atualizar serviço',
        details: error.message 
      });
    }
    return res.status(500).json({ error: 'Erro desconhecido ao atualizar serviço' });
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
