export class Cliente {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;

    constructor(
        nombre: string = '',
        email: string = '',
        telefono: string = '',
        direccion: string = '',
        ciudad: string = ''
    ) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.ciudad = ciudad;
    }

    validarEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    validarCamposObligatorios(): boolean {
        if (!this.nombre || this.nombre.trim() === '') return false;
        if (!this.email || this.email.trim() === '') return false;
        if (!this.telefono || this.telefono.trim() === '') return false;
        if (!this.direccion || this.direccion.trim() === '') return false;
        if (!this.ciudad || this.ciudad.trim() === '') return false;
        return true;
    }
}
