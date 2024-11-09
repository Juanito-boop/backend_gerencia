import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import seguridad from "../../middleware/Seguridad";

import rutasUsuario from "../../routes/rutasUsuario";
import rutasSinMiddleware from "../../routes/rutasSinMiddleware";
import tokenRuta from "../../routes/TokenRuta";
import rutasBD from "../../routes/rutasBD";
import {
	formatMethodColor,
	formatStatusCodeColor,
	formatTimeColor,
} from "./methods";
import { morganToken } from "../../interface/interfaces";
import { connectToDatabase } from "../connection/conexion";

const tokens: morganToken[] = [
	{
		name: "colored-method",
		formatter: (req: express.Request, _res: express.Response): string =>
			formatMethodColor(req.method),
	},
	{
		name: "colored-status-code",
		formatter: (_req: express.Request, res: express.Response): string =>
			formatStatusCodeColor(res.statusCode),
	},
	{
		name: "colored-response-time",
		formatter: (_req: express.Request, res: express.Response): string =>
			formatTimeColor(res.getHeader("x-execution-time")),
	},
];

class Servidor {
	public app: express.Application;
	public port: string;
	public v1: string = "/api/v1/public";
	public swaggerDocument = YAML.load("./api.yml");

	constructor() {
		this.app = express();
		config({ path: "./.env" });
		this.port = process.env.SERVER_PORT || "8080";
		this.iniciarConfig();
		this.activarRutas();
		connectToDatabase();
	}

	private iniciarConfig(): void {
		tokens.forEach((token) => morgan.token(token.name, token.formatter));

		this.app.set("PORT", this.port);
		this.app.use(cors());

		this.app.use(
			morgan(
				`:colored-method \x1b[37m:url\x1b[0m :colored-status-code \x1b[37m:response-time\x1b[0m`
			)
		);

		this.app.use(express.json({ limit: "100mb" }));
		this.app.use(express.urlencoded({ extended: true }));
	}

	private activarRutas(): void {
		this.app.use((_req, res, next) => {
			const start = Date.now();
			const originalSend = res.send;

			res.send = function (...args) {
				const duration = Date.now() - start;
				res.setHeader("x-execution-time", `${duration} ms`);
				return originalSend.apply(res, args);
			};
			next();
		});

		// api
		this.app.use(`${this.v1}/db`, rutasBD);
		this.app.use(`${this.v1}/token`, tokenRuta);
		this.app.use(`${this.v1}/crearUsuario`, rutasSinMiddleware);
		this.app.use(`${this.v1}/usuarios`,seguridad.revisar,rutasUsuario);

		// documentación
		this.app.use(`${this.v1}/docs`,swaggerUi.serve, swaggerUi.setup(this.swaggerDocument));
	}

	public arrancar(): void {
		const puerto = this.app.get("PORT");
		const servidor = this.app.listen(puerto, () => {
			console.log(`Servidor corriendo en el puerto ${puerto}`);
		});

		servidor.on("error", (error: any) => {
			if (error.code === "EADDRINUSE") {
				console.log(
					`Puerto ${puerto} está ocupado, intentando con el siguiente...`
				);
				const nuevoPuerto = parseInt(puerto) + 1;
				this.app.set("PORT", nuevoPuerto.toString());
				this.arrancar();
			}
		});
	}
}

export default Servidor;
