import { pool } from "../config/connection/conexion";
import { SQL_EVENTOS } from "../repository/crudSQL";
import Result from "../utils/Result";
import { Event, EventoCreationResult } from "../interface/interfazEvento";

export default class eventoDAO {
	public static async createEvent(
		data: Omit<Event, "id_evento">
	): Promise<Result<EventoCreationResult>> {
		try {
			const existingEvent = await pool.oneOrNone(
				SQL_EVENTOS.checkIfEventExists,
				[data.nombre_evento, data.fecha_evento, data.hora_evento]
			);

			if (existingEvent) {
				return Result.fail("El evento ya existe.");
			}

			const result = await this.insertEvent(data);
			return result;
		} catch (error: any) {
			console.error(
				`Error al verificar existencia de evento: ${error.message}`
			);
			return Result.fail(`No se puede crear el evento: ${error.message}`);
		}
	}

	private static async insertEvent(
		data: Omit<Event, "id_evento">
	): Promise<Result<EventoCreationResult>> {
		try {
			const result: EventoCreationResult = await pool.one(
				SQL_EVENTOS.addNewEvent,
				[
					data.nombre_evento,
					data.descripcion_evento,
					data.organizador_evento,
					data.lugar_evento,
					data.fecha_evento,
					data.hora_evento,
					data.valor_evento,
					data.id_usuario,
					data.id_lugar,
				]
			);
			return Result.success({ id_evento: result.id_evento });
		} catch (error: any) {
			console.error(
				`Error al insertar evento en la base de datos: ${error.message}`
			);
			return Result.fail(`No se puede crear el evento: ${error.message}`);
		}
	}

	public static async getEvent(id_evento: number): Promise<Result<Event>> {
		try {
			const result: Event = await pool.one(
				SQL_EVENTOS.getEvent,
				id_evento
			);
			return Result.success(result);
		} catch (error) {
			return Result.fail(`No se puede obtener los eventos, ${error}`);
		}
	}

	public static async getEvents() {
		try {
			const result: Event[] = await pool.manyOrNone(SQL_EVENTOS.getAllEvents);
			return Result.success(result);
		} catch (error) {
			return Result.fail(`No se puede obtener los eventos, ${error}`);
		}
	}
}