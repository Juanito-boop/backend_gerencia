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
				res.status(200).json(profile);
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

	public static async updateUserProfile(req: Request, res: Response) {
		const requestedUsername: string = req.params.username;
		const url: string = req.body.url;

		try {
			await perfilDAO.updateUserProfile(requestedUsername, url);
			res.status(200).json({ mensaje: "Foto de perfil actualizada" });
		} catch (error: any) {
			res
				.status(500)
				.json({
					mensaje: `Error al actualizar el perfil del usuario: ${error.message}`,});
				}
	}
}

export default perfilController;