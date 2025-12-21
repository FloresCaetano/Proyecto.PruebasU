import { Cliente } from './cliente';

describe('Cliente', () => {
    let cliente: Cliente;

    beforeEach(() => {
        cliente = new Cliente('Juan Perez', 'juan@example.com', '0998765432', 'Av Principal', 'Quito');
    });

    it('should create an instance', () => {
        expect(cliente).toBeTruthy();
    });

    it('should accept valid email', () => {
        cliente.email = 'test@valid.com';
        expect(cliente.validarEmail()).toBeTrue();
    });

    it('should reject invalid email', () => {
        cliente.email = 'invalid-email';
        expect(cliente.validarEmail()).toBeFalse();
    });

    it('should reject email without domain', () => {
        cliente.email = 'user@';
        expect(cliente.validarEmail()).toBeFalse();
    });

    it('should validate correctly when all required fields are present', () => {
        expect(cliente.validarCamposObligatorios()).toBeTrue();
    });

    it('should be invalid if name is empty', () => {
        cliente.nombre = '';
        expect(cliente.validarCamposObligatorios()).toBeFalse();
    });

    it('should be invalid if name is only whitespace', () => {
        cliente.nombre = '   ';
        expect(cliente.validarCamposObligatorios()).toBeFalse();
    });

    it('should be invalid if email is empty', () => {
        cliente.email = '';
        expect(cliente.validarCamposObligatorios()).toBeFalse();
    });

    it('should be invalid if telefono is empty', () => {
        cliente.telefono = '';
        expect(cliente.validarCamposObligatorios()).toBeFalse();
    });

    it('should be invalid if direccion is empty', () => {
        cliente.direccion = '';
        expect(cliente.validarCamposObligatorios()).toBeFalse();
    });

    it('should be invalid if ciudad is empty', () => {
        cliente.ciudad = '';
        expect(cliente.validarCamposObligatorios()).toBeFalse();
    });
});
