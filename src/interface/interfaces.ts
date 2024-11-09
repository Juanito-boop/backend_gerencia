import express from "express";

export interface User {
	user_id: string;
	nombre: string;
	apellido: string;
	email: string;
	username: string;
	password: string;
	rol: Rol;
	created_at: Date;
	updated_at: Date;
}

export interface userData {
	nombre: string;
	apellido: string;
	email: string;
	username: string;
	password: string;
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

export interface morganToken {
	name: string;
	formatter: (req: express.Request, res: express.Response) => string;
}
