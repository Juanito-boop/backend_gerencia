import { Request, Response } from "express";
import eventoDAO from "../dao/eventoDAO";
import Result from "../utils/Result";
import { Event } from "../interface/interfazEvento";

class eventosController {
	public async insertEvent(req: Request, res: Response){
		const {nombre_evento,descripcion_evento,organizador_evento,lugar_evento,fecha_evento,hora_evento,valor_evento} = req.body

		const fieldsToValidate = [
			{ name: "nombre_evento", value: nombre_evento, type: "string" },
			{ name: "descripcion_evento", value: descripcion_evento, type: "string" },
			{ name: "organizador_evento", value: organizador_evento, type: "string" },
			{ name: "lugar_evento", value: lugar_evento, type: "string" },
			{ name: "fecha_evento", value: fecha_evento, type: "Date" },
			{ name: "hora_evento", value: hora_evento, type: "string" },
			{ name: "valor_evento", value: valor_evento, type: "number" },
		];

		const invalidField = fieldsToValidate.find(
			({value, type}) => typeof value != type
		)

		if (invalidField) {
			return res
				.status(400)
				.json(`Invalid data type for field ${invalidField.name}`)
		}

		try {
			const data: Event = {
				nombre_evento,
				descripcion_evento,
				organizador_evento,
				lugar_evento,
				fecha_evento,
				hora_evento,
				valor_evento
			}

			const result = await eventoDAO.createEvent(data)
			if (result.isSuccess) {
				return res.status(200).json(result.getValue)
			} else {
				return res.status(400).json({error: result.isFailure})
			}
		} catch (error: any) {
			return res
				.status(500)
				.json(`Error al crear el evento: ${error.message}`);
		}
	}
}

const EventoController = new eventosController()
export default EventoController;