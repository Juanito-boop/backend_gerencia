import { Router } from "express";
import lugaresController from "../controllers/lugaresController";

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
		this.rutasApi.post("/", lugaresController.insertLugar);
    this.rutasApi.get("/", lugaresController.getAllLugares);
		this.rutasApi.get("/:nombreLugar", lugaresController.getLugar);
		this.rutasApi.put("/:id_lugar", lugaresController.updateLugar);
		this.rutasApi.delete("/:id_lugar", lugaresController.deleteLugar);
	}
}

export default new Rutas().rutasApi;