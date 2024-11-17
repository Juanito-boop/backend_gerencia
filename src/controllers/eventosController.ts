import { Request, Response } from "express";
import eventoDAO from "../dao/eventoDAO";
import Result from "../utils/Result";
import { Event, EventoCreationResult } from "../interface/interfazEvento";

class eventosController {
	public async insertEvent(req: Request, res: Response) {
		const {
			nombre_evento,
			descripcion_evento,
			organizador_evento,
			lugar_evento,
			fecha_evento,
			hora_evento,
			valor_evento,
			id_usuario,
			id_lugar
		} = req.body;
		console.log(req.body);

		// Validación de tipos de datos
		const fieldsToValidate = [
			{ name: "nombre_evento"     , value: nombre_evento     , type: "string" },
			{ name: "descripcion_evento", value: descripcion_evento, type: "string" },
			{ name: "organizador_evento", value: organizador_evento, type: "string" },
			{ name: "lugar_evento"      , value: lugar_evento      , type: "string" },
			{ name: "fecha_evento"      , value: fecha_evento      , type: "string" },
			{ name: "hora_evento"       , value: hora_evento       , type: "string" },
			{ name: "valor_evento"      , value: valor_evento      , type: "number" },
			{ name: "id_usuario"        , value: id_usuario        , type: "string" },
			{ name: "id_lugar"          , value: id_lugar          , type: "string" },
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
			const data = {
				nombre_evento,
				descripcion_evento,
				organizador_evento,
				lugar_evento,
				fecha_evento,
				hora_evento,
				valor_evento,
				id_usuario,
				id_lugar
			};

			const result: Result<EventoCreationResult, string> =
				await eventoDAO.createEvent(data);
			if (result.isSuccess) {
				return res.status(200).json(result.getValue());
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			console.error(`Error al crear el evento: ${error.message}`);
			return res.status(500).json(`Error al crear el evento: ${error.message}`);
		}
	}

	public async fetchEvent(req: Request, res: Response) {
		const id_evento: number = parseInt(req.params.id_evento);

		if (isNaN(id_evento)) {
			return res.status(400).json("Invalid data type for field id_evento");
		}

		try {
			const result: Result<Event, string> = await eventoDAO.getEvent(id_evento);
			if (result.isSuccess) {
				return res.status(200).json(result.getValue());
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			return res
				.status(500)
				.json(`Error al obtener el evento: ${error.message}`);
		}
	}

	public async fetchAllEvents(req: Request, res: Response) {
		try {
			const result = await eventoDAO.getEvents();
			if (result.isSuccess) {
				return res.status(200).json(result.getValue());
			} else {
				return res.status(400).json({ error: result.errorValue() });
			}
		} catch (error: any) {
			return res
				.status(500)
				.json(`Error al obtener los eventos: ${error.message}`);
		}
	}
}

const EventoController = new eventosController();
export default EventoController;
