import { Request, Response } from "express";
import lugarDAO from "../dao/lugarDAO";
import Result from "../utils/Result";
import { LugarCreationResult, Lugar } from "../interface/interfazLugares";

class lugaresController {
	public async insertLugar(req: Request, res: Response) {
		const { nombreLugar, direccionLugar, aforoTotalLugar } = req.body;

		const fieldsToValidate = [
			{ name: "nombreLugar", value: nombreLugar, type: "string" },
			{ name: "direccionLugar", value: direccionLugar, type: "string" },
			{ name: "aforoTotalLugar", value: aforoTotalLugar, type: "number" },
		];

		const invalidField = fieldsToValidate.find(
			({ value, type }) => typeof value !== type
		);

		if (invalidField) {
			return res
				.status(400)
				.json(
					`Error: Tipo de dato incorrecto para el campo ${invalidField.name}`
				);
		}

		try {
			const data: Omit<Lugar, "id_lugar"> = {
				nombrelugar: nombreLugar,
				direccionlugar: direccionLugar,
				aforototallugar: aforoTotalLugar,
			};

			const result: Result<LugarCreationResult, string> =
				await lugarDAO.createLugar(data);

			if (result.isSuccess) {
				return res.status(200).json(result.getValue()); // Devolver el ID del nuevo lugar
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			console.error(`Error al crear el lugar: ${error.message}`);
			return res.status(500).json({ error: "Error al crear el lugar" });
		}
	}

	public async getLugar(req: Request, res: Response) {
		const nombreLugar: string = req.params.nombreLugar;

		try {
			const result: Result<Lugar, string> = await lugarDAO.getLugar(
				nombreLugar
			);
			if (result.isSuccess) {
				return res.status(200).json(result.getValue());
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			console.error(`Error al obtener el lugar: ${error.message}`);
			return res.status(500).json({ error: "Error al obtener el lugar" });
		}
	}

	public async getAllLugares(_req: Request, res: Response) {
		try {
			const result = await lugarDAO.getAllLugares();
			if (result.isSuccess) {
				return res.status(200).json(result.getValue());
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			console.error(`Error al obtener los lugares: ${error.message}`);
			return res.status(500).json({ error: "Error al obtener los lugares" });
		}
	}

	public async updateLugar(req: Request, res: Response) {
		const id_lugar = req.params.id_lugar;
		try {
			const { nombrelugar, direccionlugar, aforototallugar } = req.body;

			// Validación de tipos de datos
			const fieldsToValidate = [
				{ name: "nombrelugar", value: nombrelugar, type: "string" },
				{ name: "direccionlugar", value: direccionlugar, type: "string" },
				{ name: "aforototallugar", value: aforototallugar, type: "number" },
			];

			const invalidField = fieldsToValidate.find(
				({ value, type }) => typeof value !== type
			);

			if (invalidField) {
				return res.status(400).json({
					error: `Tipo de dato incorrecto para el campo ${invalidField.name}`,
				});
			}

			// Crear el objeto data con los campos correctos
			const data: Omit<Lugar, "id_lugar"> = {
				nombrelugar,
				direccionlugar,
				aforototallugar,
			};

			const lugarActualizado = await lugarDAO.updateLugar(id_lugar, data);

			if (lugarActualizado.isSuccess) {
				return res.status(200).json(lugarActualizado.getValue());
			} else {
				return res.status(400).json({ error: lugarActualizado.errorValue() });
			}
		} catch (error: any) {
			console.error(`Error al actualizar el lugar: ${error.message}`);
			return res.status(500).json({ error: "Error al actualizar el lugar" });
		}
	}

	public async deleteLugar(req: Request, res: Response) {
		const id_lugar = req.params.id_lugar;

		try {
			const lugarEliminado = await lugarDAO.deleteLugar(id_lugar);

			if (lugarEliminado.isSuccess) {
				return res.status(200).json(lugarEliminado.getValue());
			} else {
				return res.status(400).json({ error: lugarEliminado.errorValue() });
			}
		} catch (error: any) {
			console.error(`Error al eliminar el lugar: ${error.message}`);
			return res.status(500).json({ error: "Error al eliminar el lugar" });
		}
	}
}

export default new lugaresController();
