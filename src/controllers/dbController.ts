import { Request, Response } from "express";
import { pool } from "../config/connection/conexion";

class dbController {
	public async createTables(req: Request, res: Response): Promise<void> {
		const createSQL = `
		DO $$ 
			DECLARE r RECORD;
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
					EXECUTE 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
				END IF;

				EXECUTE '
				CREATE TYPE rol_enum AS ENUM (
					''administrador'',
					''usuario'',
					''proveedor'',
					''establecimiento''
				);';

				EXECUTE '
				CREATE TABLE IF NOT EXISTS users (
					user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
					nombre VARCHAR(100) NOT NULL,
					apellido VARCHAR(100) NOT NULL,
					email VARCHAR(100) UNIQUE NOT NULL,
					username VARCHAR(50) UNIQUE NOT NULL,
					password TEXT NOT NULL,
					avatar_url TEXT,
					rol rol_enum NOT NULL,
					created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMPTZ
				);';

				EXECUTE 'CREATE INDEX idx_users_username ON users(username);';
		END $$;`;
		try {
			await pool.query(createSQL);
			res.status(200).send("Operación exitosa");
		} catch (err) {
			console.error(err);
			res.status(500).send("Error ejecutando query");
		}
	}

	public async dropTables(req: Request, res: Response): Promise<void> {
		const dropSQL = `
		DO $$ 
			DECLARE r RECORD;
			BEGIN
				FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
					EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;';
				END LOOP;

				FOR r IN (SELECT typname FROM pg_type WHERE typcategory = 'E' AND typnamespace = 'public'::regnamespace) LOOP
					EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE;';
				END LOOP;
		END $$;`;
		try {
			await pool.query(dropSQL);
			res.status(200).send("Operación exitosa");
		} catch (err) {
			console.error(err);
			res.status(500).send("Error ejecutando query");
		}
	}

	public async truncateTables(req: Request, res: Response): Promise<void> {
		const truncateSQL = `
		DO $$ 
			DECLARE r RECORD;
			BEGIN
				FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
					EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE;';
				END LOOP;
		END $$;`;
		try {
			await pool.query(truncateSQL);
			res.status(200).send("Operación exitosa");
		} catch (err) {
			console.error(err);
			res.status(500).send("Error ejecutando query");
		}
	}
}

const DbController = new dbController();
export default DbController;
