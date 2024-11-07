export const SQL_TOKEN = {
	getUserToken: `
	  SELECT 
			username, 
			rol 
	  FROM users 
	  WHERE username = $1 AND password = $2`,

	getUserCredentials: `
		SELECT 
			password 
		FROM users 
		WHERE username = $1;`,
};

export const SQL_USUARIO = {
	fetchUser: `
		SELECT 
			user_id, nombre, apellido, 
			email, username, avatar_url, 
			rol, created_at, updated_at
		FROM users 
		WHERE users.username = $1;`,

	findAllUsers: `
		SELECT 
			users.nombre, users.apellido, users.username, 
			roles.nombre_rol as rol
		FROM users 
		JOIN roles ON users.rol = roles.id_rol;`,

	insertUser: `
		INSERT INTO users 
			(nombre, apellido, email, username, password, avatar_url, rol, created_at) 
		VALUES 
			($1, $2, $3, $4, $5, $6, $7::rol_enum, CURRENT_TIMESTAMP) 
		RETURNING user_id;`,

	checkUserExists: `
		SELECT 
			user_id 
		FROM users 
		WHERE email = $1 OR username = $2;`,
};

export const SQL_PERFIL = {
	fetchUserProfile: `
		SELECT username, avatar_url, user_id 
		FROM perfiles 
		WHERE username = $1;
	`,
};