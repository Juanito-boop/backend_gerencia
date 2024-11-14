export interface Event {
  id_evento: number,
  nombre_evento: string,
  descripcion_evento: string,
  organizador_evento: string,
  lugar_evento:string,
  fecha_evento: Date,
  hora_evento: Date,
  valor_evento: number
}

export interface EventoCreationResult {
  id_evento: number;
}
