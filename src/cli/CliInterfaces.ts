import * as readline from 'readline';
import { IncidenteService } from '../services/IncidenteService.js';
import type { Incidente } from '../types/Types.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const service = new IncidenteService();

const cuestionario = (pregunta: string): Promise<string> => {
    return new Promise((resolve) => rl.question(pregunta, resolve));
};

export async function menuPrincipal() {
    console.clear();
    console.log("=== GESTIÓN DE INCIDENTES BY JEREMYYYY ===");
    console.log("1. Ver tickets activos ");
    console.log("2. Crear un nuevo ticket");
    console.log("3. Salir");
    
    const opcion = await cuestionario("\nSelecciona una opción: ");

    switch (opcion.trim()) {
        case '1':
            await menuVerTickets();
            break;
        case '2':
            await menuCrearTicket();
            break;
        case '3':
            console.log("\n¡Hasta luego!");
            rl.close();
            process.exit(0);
        default:
            console.log("\nOpción no válida. Presiona Enter...");
            await cuestionario("");
            await menuPrincipal();
            break;
    }
}

async function menuCrearTicket() {
    console.clear();
    console.log("=== CREAR NUEVO TICKET ===");
    
    const usuario = await cuestionario("Tu usuario (Reportado por): ");
    const titulo = await cuestionario("Título del problema: ");
    const descripcion = await cuestionario("Descripción del problema: ");

    if (!usuario || !titulo || !descripcion) {
        console.log("\n[Error] Todos los campos son obligatorios.");
    } else {
        const ticket = service.crearIncidente(titulo, descripcion, usuario);
        console.log(`\n✔ Ticket creado con éxito. ID: ${ticket.id} (Estado: ${ticket.estado})`);
    }

    await cuestionario("\nPresiona Enter para volver al menú principal...");
    await menuPrincipal();
}

async function menuVerTickets() {
    console.clear();
    console.log("=== TICKETS ACTIVOS ===");
    
    const activos = service.obtenerTicketsActivos();

    if (activos.length === 0) {
        console.log("No hay tickets activos en este momento.");
        await cuestionario("\nPresiona Enter para volver...");
        await menuPrincipal();
        return;
    }

    activos.forEach((ticket, index) => {
        console.log(`${index + 1}. [${ticket.id}] | Estado: ${ticket.estado.toUpperCase()} | Por: ${ticket.reportadoPor}`);
        console.log(`   Título: ${ticket.titulo}`);
        console.log(`   Descripción: ${ticket.descripcion}`);
        console.log(`   Fecha: ${ticket.fechaCreacion.toLocaleString()}\n------------------------------------------------`);
    });

    console.log("Opciones:");
    console.log("- Ingresa el número del ticket (ej. 1) para gestionar su estado.");
    console.log("- Ingresa 'M' para volver al menú principal.");

    const seleccion = await cuestionario("\nSelección: ");

    if (seleccion.toUpperCase().trim() === 'M') {
        await menuPrincipal();
        return;
    }

    const indexSeleccionado = parseInt(seleccion) - 1;

    if (isNaN(indexSeleccionado) || indexSeleccionado < 0 || indexSeleccionado >= activos.length) {
        console.log("\nSelección inválida. Presiona Enter para continuar...");
        await cuestionario("");
        await menuVerTickets();
        return;
    }

    const ticketSeleccionado = activos[indexSeleccionado]!;
    await gestionarEstadoTicket(ticketSeleccionado);
}

async function gestionarEstadoTicket(ticket: Incidente) {
    console.clear();
    console.log(`=== GESTIONAR TICKET ${ticket.id} ===`);
    console.log(`Título: ${ticket.titulo}`);
    console.log(`Estado actual: ${ticket.estado.toUpperCase()}\n`);

    if (ticket.estado === 'abierto') {
        console.log("1. Cambiar estado a 'En progreso...'");
        console.log("2. Volver atrás");
        
        const op = await cuestionario("\nSelecciona una opción: ");
        if (op === '1') {
            service.empezarProgreso(ticket.id);
            console.log(`\n✔ El ticket ${ticket.id} ahora está EN PROGRESO.`);
            await cuestionario("");
        }
    } else if (ticket.estado === 'en progreso') {
        console.log("1. Marcar como Terminado ('Resuelto/Finalizado')");
        console.log("2. Volver atrás");

        const op = await cuestionario("\nSelecciona una opción: ");
        if (op === '1') {
            service.finalizarIncidente(ticket.id);
            console.log(`\n✔ El ticket ${ticket.id} ha sido RESUELTO.`);
            await cuestionario("");
        }
    }

    await menuVerTickets();
}