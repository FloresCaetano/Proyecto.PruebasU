import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Servicio de Clientes', () => {
    let service: ClienteService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ClienteService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(ClienteService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debería ser creado', () => {
        expect(service).toBeTruthy();
    });

    it('debería devolver una lista de clientes', () => {
        const dummyClientes: Cliente[] = [
            new Cliente('Juan', 'juan@test.com'),
            new Cliente('Maria', 'maria@test.com')
        ];

        service.getClientes().subscribe(clientes => {
            expect(clientes.length).toBe(2);
            expect(clientes).toEqual(dummyClientes);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/clientes');
        expect(req.request.method).toBe('GET');
        req.flush(dummyClientes);
    });

    it('debería obtener un cliente por id', () => {
        const dummyCliente = new Cliente('Juan', 'juan@test.com');
        dummyCliente._id = '1';

        service.getCliente('1').subscribe(cliente => {
            expect(cliente).toEqual(dummyCliente);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/clientes/1');
        expect(req.request.method).toBe('GET');
        req.flush(dummyCliente);
    });

    it('debería agregar un cliente', () => {
        const newCliente = new Cliente('Juan', 'juan@test.com');
        const returnedCliente = new Cliente('Juan', 'juan@test.com');
        returnedCliente._id = '1';

        service.addCliente(newCliente).subscribe(cliente => {
            expect(cliente).toEqual(returnedCliente);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/clientes');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newCliente);
        req.flush(returnedCliente);
    });

    it('debería actualizar un cliente', () => {
        const updatedCliente = new Cliente('Juan Updated', 'juan@test.com');
        updatedCliente._id = '1';

        service.updateCliente(updatedCliente).subscribe(cliente => {
            expect(cliente).toEqual(updatedCliente);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/clientes/1');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedCliente);
        req.flush(updatedCliente);
    });

    it('debería eliminar un cliente', () => {
        const id = '1';

        service.deleteCliente(id).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`http://localhost:3000/api/clientes/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('debería manejar error del backend cuando se intenta agregar un cliente con nombre vacío', () => {
        const newCliente = new Cliente('', 'juan@test.com');

        service.addCliente(newCliente).subscribe({
            next: () => fail('Debería haber fallado con error 400'),
            error: (error) => {
                expect(error.status).toBe(400);
            }
        });

        const req = httpMock.expectOne('http://localhost:3000/api/clientes');
        expect(req.request.method).toBe('POST');
        req.flush('Nombre requerido', { status: 400, statusText: 'Bad Request' });
    });

    it('debería manejar error del backend cuando se intenta actualizar un cliente con email inválido', () => {
        const updatedCliente = new Cliente('Juan', 'invalid-email');
        updatedCliente._id = '1';

        service.updateCliente(updatedCliente).subscribe({
            next: () => fail('Debería haber fallado con error 400'),
            error: (error) => {
                expect(error.status).toBe(400);
            }
        });

        const req = httpMock.expectOne('http://localhost:3000/api/clientes/1');
        expect(req.request.method).toBe('PUT');
        req.flush('Email inválido', { status: 400, statusText: 'Bad Request' });
    });
});
