import { TestBed } from '@angular/core/testing';
import { VendedorService } from './vendedor.service';
import { Vendedor } from './vendedor';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Servicio de Vendedores', () => {
    let service: VendedorService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                VendedorService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(VendedorService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debería ser creado', () => {
        expect(service).toBeTruthy();
    });

    it('debería devolver una lista de vendedores', () => {
        const dummyVendedores: Vendedor[] = [
            new Vendedor('Ana García', 'ana.garcia@concesionaria.com', '0987654321', 20, 'EMP-123'),
            new Vendedor('Luis Pérez', 'luis@ejemplo.com', '0912345678', 15, 'EMP-456')
        ];

        service.getVendedores().subscribe(vs => {
            expect(vs.length).toBe(2);
            expect(vs).toEqual(dummyVendedores);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        expect(req.request.method).toBe('GET');
        req.flush(dummyVendedores);
    });

    it('debería obtener un vendedor por id', () => {
        const dummy = new Vendedor('Ana García', 'ana.garcia@concesionaria.com', '0987654321', 20, 'EMP-123');
        dummy.id = 1;

        service.getVendedor(1).subscribe(v => {
            expect(v).toEqual(dummy);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores/1');
        expect(req.request.method).toBe('GET');
        req.flush(dummy);
    });

    it('debería agregar un vendedor', () => {
        const newV = new Vendedor('Ana García', 'ana.garcia@concesionaria.com', '0987654321', 20, 'EMP-123');
        const returned = new Vendedor('Ana García', 'ana.garcia@concesionaria.com', '0987654321', 20, 'EMP-123');
        returned.id = 1;

        service.addVendedor(newV).subscribe(v => {
            expect(v).toEqual(returned);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newV);
        req.flush(returned);
    });

    it('debería actualizar un vendedor', () => {
        const updated = new Vendedor('Ana G. Actualizada', 'ana.garcia@concesionaria.com', '0987654321', 20, 'EMP-999');
        updated.id = 1;

        service.updateVendedor(updated).subscribe(v => {
            expect(v).toEqual(updated);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores/1');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updated);
        req.flush(updated);
    });

    it('debería eliminar un vendedor', () => {
        const id = 1;

        service.deleteVendedor(id).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`http://localhost:3000/api/vendedores/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('debería fallar al agregar si falta name (400)', () => {
        const invalid = new Vendedor('', 'x@test.com', '1234567', 10, 'EMP-124');

        service.addVendedor(invalid).subscribe({
            next: () => fail('Debería haber fallado con 400'),
            error: (err) => expect(err.status).toBe(400)
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        expect(req.request.method).toBe('POST');
        req.flush('Nombre requerido', { status: 400, statusText: 'Bad Request' });
    });

    it('debería fallar al agregar si email inválido (400)', () => {
        const invalid = new Vendedor('Pedro', 'correo_malo.com', '1234567', 15, 'EMP-130');

        service.addVendedor(invalid).subscribe({
            next: () => fail('Debería haber fallado con 400'),
            error: (err) => expect(err.status).toBe(400)
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        expect(req.request.method).toBe('POST');
        req.flush('Email inválido', { status: 400, statusText: 'Bad Request' });
    });

    it('debería fallar al agregar teléfono inválido (400)', () => {
        const invalid = new Vendedor('Pedro', 'pedro@test.com', '12abc', 10, 'EMP-150');

        service.addVendedor(invalid).subscribe({
            next: () => fail('Debería haber fallado con 400'),
            error: (err) => expect(err.status).toBe(400)
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        expect(req.request.method).toBe('POST');
        req.flush('Teléfono inválido', { status: 400, statusText: 'Bad Request' });
    });

    it('debería fallar si la comisión está fuera de rango (400)', () => {
        const invalid = new Vendedor('Luis', 'l@test.com', '1234567', 150, 'EMP-129');

        service.addVendedor(invalid).subscribe({
            next: () => fail('Debería haber fallado con 400'),
            error: (err) => expect(err.status).toBe(400)
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        expect(req.request.method).toBe('POST');
        req.flush('Comisión inválida', { status: 400, statusText: 'Bad Request' });
    });

    it('debería manejar email duplicado al crear (409)', () => {
        const v1 = new Vendedor('Repetido', 'dup@test.com', '1234567', 10, 'EMP-1000');
        const v2 = new Vendedor('Repetido2', 'dup@test.com', '1234567', 10, 'EMP-2000');

        // primer post
        service.addVendedor(v1).subscribe(res => expect(res).toBeTruthy());
        let req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        req.flush({ id: 10, ...v1 });

        // segundo post con email duplicado
        service.addVendedor(v2).subscribe({
            next: () => fail('Debería haber fallado con 409'),
            error: (err) => expect(err.status).toBe(409)
        });
        req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        req.flush({ message: 'Email duplicado' }, { status: 409, statusText: 'Conflict' });
    });

    it('debería devolver 404 al obtener un id inexistente', () => {
        service.getVendedor(999999).subscribe({
            next: () => fail('Debería haber devuelto 404'),
            error: (err) => expect(err.status).toBe(404)
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores/999999');
        expect(req.request.method).toBe('GET');
        req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    });

    it('debería devolver 404 al actualizar un vendedor inexistente', () => {
        const updated = new Vendedor('No existe', 'no@ex.com', '123', 10, 'EMP-9999');
        updated.id = 999999;

        service.updateVendedor(updated).subscribe({
            next: () => fail('Debería haber devuelto 404'),
            error: (err) => expect(err.status).toBe(404)
        });

        const req = httpMock.expectOne('http://localhost:3000/api/vendedores/999999');
        expect(req.request.method).toBe('PUT');
        req.flush('No encontrado', { status: 404, statusText: 'Not Found' });
    });

    it('debería devolver 409 si codigoEmpleado duplicado al crear', () => {
        const v1 = new Vendedor('Pedro', 'pedro@test.com', '12345678', 10, 'EMP-100');
        const v2 = new Vendedor('Juan', 'juan@test.com', '87654321', 20, 'EMP-100');

        service.addVendedor(v1).subscribe(res => expect(res).toBeTruthy());
        let req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        req.flush({ id: 20, ...v1 });

        service.addVendedor(v2).subscribe({
            next: () => fail('Debería haber fallado con 409'),
            error: (err) => expect(err.status).toBe(409)
        });
        req = httpMock.expectOne('http://localhost:3000/api/vendedores');
        req.flush({ message: 'El código de empleado ya está registrado' }, { status: 409, statusText: 'Conflict' });
    });
});
