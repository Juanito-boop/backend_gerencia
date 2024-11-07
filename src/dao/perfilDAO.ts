import pool from "../config/connection/conexion";
import { Perfil } from "../interface/interfaces";
import { SQL_PERFIL } from "../repository/crudSQL";
import Result from "../utils/Result";

export default class PerfilDAO {
	public static async getUserProfile(username: string): Promise<Result<Perfil>> {
		try {
			const result = await pool.one<Perfil>(SQL_PERFIL.fetchUserProfile, [
				username,
			]);
			return Result.success(result);
		} catch (error) {
			return Result.fail(`No se puede obtener el perfil del usuario, ${error}`);
		}
	}
}
