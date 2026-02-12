require('dotenv').config();
const database = require('./config/database');
const { Auto, Cliente, Vendedor, Concesionaria, Usuario } = require('./models');

// Datos iniciales para desarrollo y testing
const seedData = {
    autos: [
        { marca: 'Toyota', modelo: 'Corolla', año: 2023, color: 'Blanco', numeroSerie: 'TOY001' },
        { marca: 'Honda', modelo: 'Civic', año: 2024, color: 'Negro', numeroSerie: 'HON001' }
    ],
    clientes: [
        { nombre: 'Carlos Rodriguez', email: 'carlos@cliente.com', telefono: '5551234567', direccion: 'Calle 123', ciudad: 'Quito' },
        { nombre: 'Ana Martinez', email: 'ana@cliente.com', telefono: '5559876543', direccion: 'Av Principal 456', ciudad: 'Guayaquil' }
    ],
    vendedores: [
        { name: 'Juan Perez', email: 'juan@empresa.com', telefono: '1234567890', comision: 5, codigoEmpleado: 'EMP001' },
        { name: 'Maria Lopez', email: 'maria@empresa.com', telefono: '0987654321', comision: 7, codigoEmpleado: 'EMP002' }
    ],
    concesionarias: [
        { nombre: 'AutoVentas Central', direccion: 'Av. Amazonas 123', telefono: '0987654321', ciudad: 'Quito', gerente: 'Roberto Silva' },
        { nombre: 'Autos del Pacifico', direccion: 'Malecón 456', telefono: '0912345678', ciudad: 'Guayaquil', gerente: 'Patricia Ruiz' }
    ],
    usuarios: [
        { nombre: 'Administrador', email: 'admin@consecionaria.com', password: 'consesionariachida' }
    ]
};

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed de la base de datos...');
        
        await database.connect();

        // Limpiar colecciones existentes
        await Promise.all([
            Auto.deleteMany({}),
            Cliente.deleteMany({}),
            Vendedor.deleteMany({}),
            Concesionaria.deleteMany({}),
            Usuario.deleteMany({})
        ]);

        // Insertar datos iniciales
        await Promise.all([
            Auto.insertMany(seedData.autos),
            Cliente.insertMany(seedData.clientes),
            Vendedor.insertMany(seedData.vendedores),
            Concesionaria.insertMany(seedData.concesionarias),
            Usuario.insertMany(seedData.usuarios)
        ]);

        console.log('✅ Base de datos inicializada correctamente');
        console.log(`- ${seedData.autos.length} autos creados`);
        console.log(`- ${seedData.clientes.length} clientes creados`);
        console.log(`- ${seedData.vendedores.length} vendedores creados`);
        console.log(`- ${seedData.concesionarias.length} concesionarias creadas`);
        console.log(`- ${seedData.usuarios.length} usuarios creados`);

        await database.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        await database.disconnect();
        process.exit(1);
    }
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, seedData };