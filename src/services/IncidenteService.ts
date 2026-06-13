import type { Incidente } from '../types/Types.js';

export class IncidenteService {
    private incidentes: Incidente[] = [];

    crearIncidente(titulo: string, descripcion: string, reportadoPor: string): Incidente {
        const nuevoIncidente: Incidente = {
            id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
            titulo,
            descripcion,
            reportadoPor,
            prioridad: 'media', 
            estado: 'abierto',  
            fechaCreacion: new Date()
        };
        
        this.incidentes.push(nuevoIncidente);
        return nuevoIncidente;
    }

    obtenerTicketsActivos(): Incidente[] {
        return this.incidentes.filter(inc => inc.estado !== 'resuelto');
    }

    buscarPorId(id: string): Incidente | undefined {
        return this.incidentes.find(inc => inc.id === id);
    }

    empezarProgreso(id: string): boolean {
        const incidente = this.buscarPorId(id);
        if (incidente && incidente.estado === 'abierto') {
            incidente.estado = 'en progreso';
            return true;
        }
        return false;
    }

    finalizarIncidente(id: string): boolean {
        const incidente = this.buscarPorId(id);
        if (incidente && incidente.estado === 'en progreso') {
            incidente.estado = 'resuelto';
            return true;
        }
        return false;
    }
}