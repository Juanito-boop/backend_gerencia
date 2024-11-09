import pgPromise from "pg-promise";
import { opcionesPG } from "./opcionConexion";
import variablesConexion from "../domain/varDB";
import Result from "../../utils/Result";

const pgp = pgPromise(opcionesPG);
const pool = pgp(variablesConexion);
const dbname = variablesConexion.database;

async function connectToDatabase() {
	try {
		const conn = await pool.connect();
		console.log("Conexión exitosa con DB:", dbname);
		conn.done();
		return Result.success(`Conectado a la base de datos: ${dbname}`);
	} catch (error: any) {
		return Result.fail(
			`Error al conectar con la base de datos: ${error.message}`
		);
	}
}

function closePool() {
	pgp.end();
}

export { pool, connectToDatabase, closePool };
