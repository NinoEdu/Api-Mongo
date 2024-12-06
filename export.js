const { MongoClient } = require('mongodb');
const fs = require('fs');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      // Escolhe um índice aleatório entre 0 e i
      const j = Math.floor(Math.random() * (i + 1));
      // Troca os elementos array[i] e array[j]
      [array[i], array[j]] = [array[j], array[i]];
  }
}

async function exportData() {
  // URL do MongoDB e o nome do banco
  const url = 'mongodb://localhost:27017';
  const dbName = 'ninoedu'; // Nome do seu banco
  const client = new MongoClient(url);

  try {
    // Conexão com o MongoDB
    await client.connect();
    console.log("Conectado ao MongoDB!");

    const db = client.db(dbName);
    const collection = db.collection('silabas_a'); // Nome da coleção

    // Busca os dados removendo o campo _id
    const data = await collection.find({}, { projection: { _id: 0 } }).toArray();
    
    // Salva os dados em um arquivo JSON
    fs.writeFileSync('dados.json', JSON.stringify(data, null, 4));
    console.log("Dados exportados para 'exported_data.json'!");

    //aleatoriza array e printa
    shuffleArray(data)
    fs.writeFileSync('dados_aleatorizados.json', JSON.stringify(data, null, 4));

    //unir dados
    //const dados_combinados = [...data1, ...data2];
    //fs.writeFileSync('dados_combinados.json', JSON.stringify(dados_combinados, null, 4));

    // Obter dados embaralhados diretamente do MongoDB usando $sample
    const shuffledData = await collection.aggregate([{ $sample: { size: 4 } }, { $project: { _id: 0 } } ]).toArray();
    fs.writeFileSync('dados_aleatorizados_mongo.json', JSON.stringify(shuffledData, null, 4));



  } catch (err) {
    console.error("Erro:", err);
  } finally {
    await client.close();
  }
}

exportData();
