import { pool } from "../config/connection/conexion";
import { SQL_EVENTOS } from "../repository/crudSQL";
import Result from "../utils/Result";
import { Event, EventoCreationResult } from "../interface/interfazEvento";

export default class eventoDAO{
	public static async createEvent(
		data: Event
	): Promise<Result<EventoCreationResult>>{
		const{nombre_evento, fecha_evento, hora_evento} = data;

		const existingEvent = await pool.oneOrNone(SQL_EVENTOS.checkEventExist,[
			nombre_evento,
			fecha_evento,
			hora_evento
		]);
		return existingEvent?.exist
		? Result.fail("El evento ya existe"):
		await this.insertEvent(data)

	}
	private static async insertEvent(
		data: Event
	): Promise<Result<EventoCreationResult>> {
		try {
			const result = await pool.task(async (consulta) => {
				return await consulta.one(
					SQL_EVENTOS.insertnewevento,
					[
						data.nombre_evento,
						data.descripcion_evento,
						data.organizador_evento,
						data.lugar_evento,
						data.fecha_evento,
						data.hora_evento,
						data.valor_evento,
					]
				)
			})
			return Result.success({ id_evento: result.id_evento})
		} catch (error) {
			return Result.fail(`No se puede crear el evento \n ${error}`)
		}
	}

}