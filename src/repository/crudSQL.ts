export const SQL_TOKEN = {
	getUserToken: `
	  SELECT 
			user_id,
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
			email, username, rol, 
			created_at, updated_at
		FROM users 
		WHERE users.username = $1;`,

	findAllUsers: `
		SELECT 
			users.nombre, users.apellido, users.username, 
			roles.nombre_rol as rol
		FROM users 
		JOIN roles ON users.rol = roles.id_rol;`,

	insertUser: `
		WITH new_user AS (
			INSERT INTO users (nombre, apellido, email, username, password, rol, created_at)
			VALUES ($1, $2, $3, $4, $5, $6::rol_enum, CURRENT_TIMESTAMP)
			RETURNING user_id
		)
			
		INSERT INTO perfiles (username, avatar_url, user_id)
			VALUES ($4, '', (SELECT user_id FROM new_user))
		RETURNING id;`,

	checkUserExists: `
		SELECT 
			user_id 
		FROM users 
		WHERE email = $1 OR username = $2;`,

	updateUserPassword: `
		UPDATE users
		SET password = $1, updated_at = CURRENT_TIMESTAMP
		WHERE username = $2
		RETURNING user_id;`,
};

export const SQL_EVENTOS = {
	addNewEvent: `
		INSERT INTO eventos (
			nombre_evento, 
			descripcion_evento, 
			organizador_evento, 
			lugar_evento, 
			fecha_evento, 
			hora_evento, 
			valor_evento,
			id_usuario,
			id_lugar
		) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		returning id_evento`,

	checkIfEventExists: `
		SELECT 
			id_evento 
		FROM eventos 
		WHERE nombre_evento = $1 
			AND fecha_evento = $2 
			AND hora_evento = $3;`,

	getEvent: `
		SELECT 
			id_evento, nombre_evento, descripcion_evento, 
			organizador_evento, lugar_evento, fecha_evento, 
			hora_evento, valor_evento
		FROM eventos
		WHERE id_evento = $1;`,

	getAllEvents: `
		SELECT 
			id_evento, nombre_evento, descripcion_evento, 
			organizador_evento, lugar_evento, fecha_evento, 
			hora_evento, valor_evento
		FROM eventos`,
};

export const SQL_LUGARES = {
	addNewLugar: `
		INSERT INTO lugares (
			nombreLugar, 
			direccionLugar, 
			aforoTotalLugar
		) VALUES ($1, $2, $3)
		 RETURNING id_lugar;`,

	checkLugarExists: `
		SELECT
			id_lugar
		FROM lugares
		WHERE nombreLugar = $1
			AND direccionLugar = $2
			AND aforoTotalLugar = $3;`,

	getLugar: `
		SELECT 
			id_lugar, 
			nombreLugar, 
			direccionLugar, 
			aforoTotalLugar 
		FROM lugares 
		WHERE nombreLugar = $1;`,

	getAllLugares: `
		SELECT 
			id_lugar, 
			nombreLugar, 
			direccionLugar, 
			aforoTotalLugar 
		FROM lugares`,

	updateLugar: `
		UPDATE lugares 
		SET nombreLugar = $2, 
				direccionLugar = $3, 
				aforoTotalLugar = $4 
		WHERE id_lugar = $1`,

	deleteLugar: `
		DELETE FROM lugares 
		WHERE id_lugar = $1;`,
};

export const SQL_PERFILES = {
	fetchUserProfile: `
		SELECT
			u.user_id,
			p.username,
			p.avatar_url,
			u.nombre,
			u.apellido,
			u.email,
			u.rol
		FROM
			perfiles p
			INNER JOIN users u on p.user_id = u.user_id
		WHERE u.username = $1 AND p.username = $1`,

		addUrlImage: `
		UPDATE perfiles
			SET avatar_url = $2
		WHERE username = $1`
};