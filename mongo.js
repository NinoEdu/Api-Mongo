const { MongoClient } = require('mongodb');

// URL do MongoDB e o nome do banco
const url = 'mongodb://localhost:27017';
const dbName = 'ninoedu'; // Nome do seu banco
const client = new MongoClient(url);

async function exportData() {
    try {
    // Conexão com o MongoDB
    await client.connect();
  
    const db = client.db(dbName);
    const collection = db.collection('silabas_a'); // Nome da coleção
  
    // Obter dados embaralhados diretamente do MongoDB usando $sample
    const data = await collection.aggregate([{ $sample: { size: 18 } }, { $project: { _id: 0 } } ]).toArray();

    return data;

    } catch (err) {
        console.error("Erro:", err);
    } finally {
        await client.close();
    }
}


module.exports = exportData;