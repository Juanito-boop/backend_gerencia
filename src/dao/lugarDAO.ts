import { pool } from "../config/connection/conexion";
import { Lugar, LugarCreationResult } from "../interface/interfazLugares";
import { SQL_LUGARES } from "../repository/crudSQL";
import Result from "../utils/Result";

export default class lugarDAO {
	public static async createLugar(
		data: Omit<Lugar, "id_lugar">
	): Promise<Result<LugarCreationResult, string>> {
		try {
			const existingLugar = await pool.oneOrNone(SQL_LUGARES.checkLugarExists, [
				data.nombreLugar,
				data.direccionLugar,
				data.aforoTotalLugar,
			]);

			if (existingLugar) {
				return Result.fail("El lugar ya existe.");
			}

			const result: Result<LugarCreationResult, string> =
				await this.insertLugar(data);
			return result;
		} catch (error: any) {
			console.error(`Error al verificar existencia de lugar: ${error.message}`);
			return Result.fail(`No se puede crear el lugar: ${error.message}`);
		}
	}

	private static async insertLugar(
		data: Omit<Lugar, "id_lugar">
	): Promise<Result<LugarCreationResult, string>> {
		try {
			// Asegurarse de capturar el ID devuelto
			const result = await pool.oneOrNone(SQL_LUGARES.addNewLugar, [
				data.nombreLugar,
				data.direccionLugar,
				data.aforoTotalLugar,
			]);
			return Result.success({ id_lugar: result.id_lugar });
		} catch (error: any) {
			console.error(
				`Error al insertar lugar en la base de datos: ${error.message}`
			);
			return Result.fail(`No se puede crear el lugar: ${error.message}`);
		}
	}

	public static async getLugar(nombre: string) {
		try {
			const result = await pool.oneOrNone(SQL_LUGARES.getLugar, nombre);
			return Result.success(result);
		} catch (error: any) {
			console.error(
				`Error al obtener lugar de la base de datos: ${error.message}`
			);
			return Result.fail(`No se puede obtener el lugar: ${error.message}`);
		}
	}

	public static async getAllLugares() {
		try {
			const result = await pool.manyOrNone(SQL_LUGARES.getAllLugares);
			return Result.success(result);
		} catch (error: any) {
			console.error(
				`Error al obtener lugares de la base de datos: ${error.message}`
			);
			return Result.fail(`No se puede obtener los lugares: ${error.message}`);
		}
	}
}
