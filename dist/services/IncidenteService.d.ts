import type { Incidente } from '../types/Types.js';
export declare class IncidenteService {
    private incidentes;
    crearIncidente(titulo: string, descripcion: string, reportadoPor: string): Incidente;
    obtenerTicketsActivos(): Incidente[];
    buscarPorId(id: string): Incidente | undefined;
    empezarProgreso(id: string): boolean;
    finalizarIncidente(id: string): boolean;
}
//# sourceMappingURL=IncidenteService.d.ts.map