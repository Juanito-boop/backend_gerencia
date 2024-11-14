import { Router } from "express";

import EventoController from "../controllers/eventosController";
import cacheMiddleware from "../middleware/Cache";

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
		// /api/v1/public/eventos
		this.rutasApi.post("/", EventoController.insertEvent);
		this.rutasApi.get("/", EventoController.fetchAllEvents);
		this.rutasApi.get("/:id_evento", EventoController.fetchEvent);
	}
}

const misRutas = new Rutas();
export default misRutas.rutasApi;
