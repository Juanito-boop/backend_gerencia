import { Router } from "express";
import perfilController from "../controllers/perfilController";
import cacheMiddleware from "../middleware/Cache";

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
			perfilController.getUserProfile
		);
	}
}

export default new PerfilRutas().rutasApi;