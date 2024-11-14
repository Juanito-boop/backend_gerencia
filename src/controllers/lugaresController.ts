import { Request, Response } from "express";
import lugarDAO from "../dao/lugarDAO";
import Result from "../utils/Result";
import { Lugar, LugarCreationResult } from "../interface/interfazLugares";

class lugaresController {
	public async insertLugar(req: Request, res: Response) {
		const { nombreLugar, direccionLugar, aforoTotalLugar } = req.body;

		const fieldsToValidate = [
			{ name: "nombreLugar"    , value: nombreLugar    , type: "string" },
			{ name: "direccionLugar" , value: direccionLugar , type: "string" },
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
				nombreLugar,
				direccionLugar,
				aforoTotalLugar,
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
}

export default new lugaresController();
