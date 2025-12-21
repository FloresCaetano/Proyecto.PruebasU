export class Vendedor {
    id?: number;
    name: string;
    email: string;
    telefono: string;
    comision: number;
    codigoEmpleado: string;

    constructor(name: string, email: string, telefono: string, comision: number, codigoEmpleado: string) {
        this.name = name;
        this.email = email;
        this.telefono = telefono;
        this.comision = comision;
        this.codigoEmpleado = codigoEmpleado;
    }
}
