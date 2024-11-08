import { Request, Response } from "express";
import PerfilDAO from "../dao/perfilDAO";
import { Perfil } from "../interface/interfaces";
import Result from "../utils/Result";

class PerfilController {
	public async fetchUserProfile(req: Request, res: Response): Promise<void> {
		const requestedUsername: string = req.params.username;

		try {
			const result: Result<Perfil> = await PerfilDAO.getUserProfile(
				requestedUsername
			);

			if (result.isSuccess) {
				const profile = result.getValue();
				res.status(200).json({
					user_id:profile.user_id,
					username: profile.username,
					avatar_url: profile.avatar_url,
				});
			} else {
				res.status(400).json({ mensaje: result.errorValue() });
			}
		} catch (error: any) {
			res
				.status(500)
				.json({ mensaje: `Error al obtener el perfil del usuario: ${error.message}` });
		}
	}
}

const perfilController = new PerfilController();
export default perfilController;
