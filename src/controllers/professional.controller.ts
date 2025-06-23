  import { Request, Response } from "express";
  import { Op, literal } from "sequelize";
  import { UserModel } from "../models/User";
  import { AddressModel } from "../models/Address";
  import { ProfessionalModel } from "../models/Professional";


  ProfessionalModel.belongsTo(UserModel, { foreignKey: "user_id" });
  ProfessionalModel.belongsTo(AddressModel, { foreignKey: "main_address_id" });

  UserModel.hasOne(ProfessionalModel, { foreignKey: "user_id" });
  AddressModel.hasMany(ProfessionalModel, { foreignKey: "main_address_id" });


  export const getProfessionals = async (req: Request, res: Response) => {
    try {
      const { termo, lat, lng, raio_km = 10 } = req.query;

      const where: any = {};
      if (termo) {
        where[Op.or] = [
          { '$User.name$':   { [Op.like]: `%${termo}%` } },
          { '$User.email$':  { [Op.like]: `%${termo}%` } },
          { cpf:             { [Op.like]: `%${termo}%` } }
        ];
      }

      const include = [
        {
          model: UserModel,
          attributes: ['name','email'],
          required: false 
        },
        {
          model: AddressModel,
          attributes: ['lat','lng','city'],
          required: false
        }
      ];

      const order: any[] = [];
      if (lat && lng) {
        const distance = literal(`
          6371 * acos(
            cos(radians(${lat})) * cos(radians(Address.lat)) *
            cos(radians(Address.lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(Address.lat))
          )
        `);
        order.push([distance, 'ASC']);
      } else {
        order.push(['createdAt', 'DESC']);
      }

      const professionals = await ProfessionalModel.findAll({
        where,
        include,
        order
      });

      res.json(professionals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar profissionais' });
    }
  };


  export const createProfessional = async (req: Request, res: Response) => {
    try {
      const newProfessional = await ProfessionalModel.create(req.body);
      res.status(201).json(newProfessional);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar profissional" });
    }
  };

  export const updateProfessional = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await ProfessionalModel.update(req.body, {
        where: { id },
      });

      if (updated) {
        const updatedProfessional = await ProfessionalModel.findByPk(id);
        return res.json(updatedProfessional);
      }

      res.status(404).json({ error: "Profissional não encontrado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar profissional" });
    }
  };

  export const deleteProfessional = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await ProfessionalModel.destroy({ where: { id } });

      if (deleted) {
        return res.json({ message: "Profissional removido com sucesso" });
      }

      res.status(404).json({ error: "Profissional não encontrado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao remover profissional" });
    }
  };

export const getProfessionalById = async (req: Request, res: Response) => {
  try {
    const professional = await ProfessionalModel.findByPk(req.params.id, {
      include: [{ model: UserModel, as: 'User' }],
    });

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.json(professional);
  } catch (err) {
    console.error('Erro ao buscar profissional:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
