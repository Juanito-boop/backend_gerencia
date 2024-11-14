import { config } from "dotenv";
import Jwt from "jsonwebtoken";
import { pool } from "../config/connection/conexion";
import { DataToken, Token } from "../interface/interfaces";
import { SQL_TOKEN } from "../repository/crudSQL";
import Result from "../utils/Result";

config({ path: "./.env" });

export default class tokenDAO {
	public static async generateToken(data: Token[]): Promise<Result<string>> {
		try {
			const result = await pool.result(SQL_TOKEN.getUserToken, data);

			if (result.rows.length === 0) {
				return Result.fail("No se encontraron registros");
			}

			const { username, rol } = result.rows[0] as DataToken;
			const secretKey = process.env.JWT_SECRET_KEY || "LaSuperClave";

			const token = Jwt.sign({ username, rol }, secretKey, {
				expiresIn: "1d",
			});

			return Result.success(token);
		} catch (error: any) {
			return Result.fail(`No se puede generar el token, ${error.message}`);
		}
	}

	public static async getUserCredentials(
		username: string
	): Promise<Result<{ password: string }>> {
		try {
			const result = await pool.oneOrNone(SQL_TOKEN.getUserCredentials, [
				username,
			]);
			return Result.success(result);
		} catch (error: any) {
			return Result.fail(
				`No se puede obtener las credenciales del usuario: ${error.message}`
			);
		}
	}
}
