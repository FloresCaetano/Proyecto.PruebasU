const mongoose = require('mongoose');

class Database {
    constructor() {
        this.mongoUrl = process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/concesionaria';
    }

    async connect() {
        try {
            await mongoose.connect(this.mongoUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('🟢 Conexión exitosa a MongoDB');
        } catch (error) {
            console.error('🔴 Error conectando a MongoDB:', error.message);
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await mongoose.connection.close();
            console.log('🟡 Desconectado de MongoDB');
        } catch (error) {
            console.error('Error desconectando de MongoDB:', error.message);
        }
    }

    getConnectionState() {
        return mongoose.connection.readyState;
    }
}

module.exports = new Database();