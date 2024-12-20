import { pool } from "../config/connection/conexion";
import { Perfil } from "../interface/interfazPerfil";
import { SQL_PERFILES } from "../repository/crudSQL";
import Result from "../utils/Result";

export default class perfilDAO {
	public static async getUserProfile(
		username: string
	): Promise<Result<Perfil, string>> {
		try {
			const result = await pool.one(SQL_PERFILES.fetchUserProfile, [
				username,
			]);
			return Result.success(result);
		} catch (error) {
			return Result.fail(`No se puede obtener el perfil del usuario, ${error}`);
		}
	}

	public static async updateUserProfile(username: string, url: string){
		try {
			const result = await pool.one(SQL_PERFILES.addUrlImage, [
				username,
				url
			])

			return Result.success(result);
		} catch (error) {
			return Result.fail(`No se puede cambiar la imagen de perfil del usuario, ${error}`);
		}
	}
}
