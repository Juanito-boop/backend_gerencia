import { Router } from "express";

import UsuarioController from "../controllers/usuarioController";
import cacheMiddleware from "../middleware/Cache";
import seguridad from "../middleware/Seguridad";

class Rutas {
	public rutasApi: Router;

	constructor() {
		this.rutasApi = Router();
		this.config();
	}

	public config() {
		this.rutas();
	}
	public rutas() {
		// /api/v1/public/usuarios
		this.rutasApi.get(
			"/:username",
			cacheMiddleware(),
			seguridad.checkRole([
				"administrador",
				"usuario",
				"establecimiento",
				"proveedor",
			]),
			UsuarioController.fetchUser
		);
		this.rutasApi.delete(
			"/:username",
			seguridad.checkRole(["administrador"]),
			UsuarioController.deleteUser
		);
	}
}

const misRutas = new Rutas();
export default misRutas.rutasApi;
