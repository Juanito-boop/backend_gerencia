import { Request, Response } from "express";
import perfilDAO from "../dao/perfilDAO";
import { Perfil } from "../interface/interfazPerfil";
import Result from "../utils/Result";

class perfilController {
  public static async getUserProfile(req: Request, res: Response) {
    const requestedUsername: string = req.params.username;

    try {
			const result: Result<Perfil> = await perfilDAO.getUserProfile(
				requestedUsername
			);

			if (result.isSuccess) {
				const profile = result.getValue();
				res.status(200).json({
					user_id: profile.user_id,
					username: profile.username,
					avatar_url: profile.avatar_url,
				});
			} else {
				res.status(400).json({ mensaje: result.errorValue() });
			}
		} catch (error: any) {
			res
				.status(500)
				.json({
					mensaje: `Error al obtener el perfil del usuario: ${error.message}`,
				});
		}
  }
}

export default perfilController;