const { MongoClient } = require('mongodb');

// URL do MongoDB e o nome do banco
const url = 'mongodb://localhost:27017';
const dbName = 'silabas_a'; // Nome do seu banco

// Criar um cliente
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Conectar ao MongoDB
async function connectDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db(dbName);
}

// Função para exportar os dados do MongoDB
async function exportData() {
    try {
        const db = await connectDB();
        const collection = db.collection('silabas_jogos');

        // Obter dados embaralhados diretamente do MongoDB usando $sample
        const data = await collection.aggregate([{ $sample: { size: 18 } }, { $project: { _id: 0 } }]).toArray();

        return data;

    } catch (err) {
        console.error("Erro ao obter dados do MongoDB:", err);
        return [];
    }
}

module.exports = exportData;
