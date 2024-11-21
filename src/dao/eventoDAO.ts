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
				return Result.fail(
					`Ya existe un evento con el nombre "${data.nombre_evento}" en la fecha y hora especificada.`
				);
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
					data.fecha_finalizacion,
					data.hora_finalizacion,
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
			const result: Event | null = await pool.oneOrNone(SQL_EVENTOS.getEvent, [
				id_evento,
			]);

			if (!result) {
				return Result.fail(`El evento con id_evento ${id_evento} no existe.`);
			}

			return Result.success(result);
		} catch (error: any) {
			console.error(`Error al obtener el evento: ${error.message}`);
			return Result.fail(`No se puede obtener el evento, ${error.message}`);
		}
	}

	public static async getEvents(): Promise<Result<Event[]>> {
		try {
			const result: Event[] = await pool.manyOrNone(SQL_EVENTOS.getAllEvents);
			
			return Result.success(result || []);
			
		} catch (error: any) {
			console.error(`Error al obtener los eventos: ${error.message}`);
			return Result.fail(`No se pueden obtener los eventos, ${error.message}`);
		}
	}

	public static async updateEvent(id_evento: number, data: Event) {
		console.log(data);
		try {
			const { nombre_evento, descripcion_evento, organizador_evento, lugar_evento, fecha_evento, hora_evento, valor_evento, id_usuario, id_lugar, fecha_finalizacion, hora_finalizacion } = data;
			const result = await pool.oneOrNone(SQL_EVENTOS.editEvent, [
				id_evento,
				nombre_evento,
				descripcion_evento,
				organizador_evento,
				lugar_evento,
				fecha_evento,
				hora_evento,
				valor_evento,
				id_usuario,
				id_lugar,
				fecha_finalizacion,
				hora_finalizacion,
			]);
			return Result.success(result);
		} catch (error: any) {
			console.error(`Error al actualizar el evento: ${error.message}`);
			return Result.fail(`No se puede actualizar el evento, ${error.message}`);
		}
	}

	public static async deleteEvent(id_evento: number) {
		try {
			const result = await pool.oneOrNone(SQL_EVENTOS.deleteEvent, [id_evento]);
			return Result.success(result);
		} catch (error: any) {
			console.error(`Error al eliminar el evento: ${error.message}`);
			return Result.fail(`No se puede eliminar el evento, ${error.message}`);
		}
	}
}
