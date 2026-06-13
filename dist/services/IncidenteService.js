export class IncidenteService {
    constructor() {
        this.incidentes = [];
    }
    crearIncidente(titulo, descripcion, reportadoPor) {
        const nuevoIncidente = {
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
    obtenerTicketsActivos() {
        return this.incidentes.filter(inc => inc.estado !== 'resuelto');
    }
    buscarPorId(id) {
        return this.incidentes.find(inc => inc.id === id);
    }
    empezarProgreso(id) {
        const incidente = this.buscarPorId(id);
        if (incidente && incidente.estado === 'abierto') {
            incidente.estado = 'en progreso';
            return true;
        }
        return false;
    }
    finalizarIncidente(id) {
        const incidente = this.buscarPorId(id);
        if (incidente && incidente.estado === 'en progreso') {
            incidente.estado = 'resuelto';
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=IncidenteService.js.map