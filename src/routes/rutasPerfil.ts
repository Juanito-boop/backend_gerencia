import { Router } from "express";
import PerfilController from "../controllers/perfilController";
import cacheMiddleware from "../middleware/Cache";
import seguridad from "../middleware/Seguridad";

class PerfilRutas {
	public rutasApi: Router;

	constructor() {
		this.rutasApi = Router();
		this.config();
	}

	public config() {
		this.rutas();
	}

	public rutas() {
		// /api/v1/public/perfiles/:username
		this.rutasApi.get(
			"/:username",
			cacheMiddleware(),
			PerfilController.fetchUserProfile
		);
	}
}

const perfilRutas = new PerfilRutas();
export default perfilRutas.rutasApi;
