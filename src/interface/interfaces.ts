import express from "express";

export interface User {
	user_id: string;
	nombre: string;
	apellido: string;
	email: string;
	username: string;
	password: string;
	avatar_url: string;
	rol: Rol;
	created_at: Date;
	updated_at: Date;
}
export interface Perfil {
	id: string;
	username: string;
	avatar_url: string;
	user_id: string;
}

export interface userData {
	nombre: string;
	apellido: string;
	email: string;
	username: string;
	password: string;
	avatar_url: string;
	rol: Rol;
}
export interface perfilData {
	
	username: string;
	avatar_url: string;
	rol: Rol;
}

export enum Rol {
	Administrador = "administrador",
	Usuario = "usuario",
	Proveedor = "proveedor",
	Establecimiento = "establecimiento",
}

export interface Token {
	username: string;
	password: string;
}

export interface DataToken {
	username: string;
	rol: string;
}

export interface UsuarioCreationResult {
	user_id: string;
}
export interface PerfilCreationResult {
	perfil_id: string;
}

export interface morganToken {
	name: string;
	formatter: (req: express.Request, res: express.Response) => string;
}
