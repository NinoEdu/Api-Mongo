const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

//conecta com mongo.js
const exportData = require('./mongo');

// Carregar os certificados SSL com tratamento de erro
let options;
try {
    options = {
        key: fs.readFileSync(path.join(__dirname, 'server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
    };
} catch (err) {
    console.error("Erro ao carregar os certificados SSL:", err);
    process.exit(1);
}

// Rota para o caminho padrão
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'jogoExportado', 'index.html')); // Verifique o caminho do arquivo HTML
});

// Configurar o Express para servir a pasta do jogo e recursos
app.use('/jogoExportado', express.static(path.join(__dirname, 'jogoExportado')));
app.use('/Vogal_A', express.static(path.join(__dirname, 'Vogal_A')));
app.use('/Teste', express.static(path.join(__dirname, 'Teste')));
app.use('/Teste_Acerte_A_Silaba', express.static(path.join(__dirname, 'Teste_Acerte_A_Silaba')));

// Servir o arquivo JSON `word.json`
app.get('/api/get-json', async (req, res) => {
    const json_data = await exportData();
    res.json(json_data);
});

// Servir imagem com base no parâmetro de consulta (query parameter)
app.get('/api/get-image', (req, res) => {
    const imageName = req.query.imageName; // Nome da imagem
    if (!imageName) {
        return res.status(400).send('Parâmetro imageName não fornecido.');
    }
    
    const imagePath = path.join(__dirname, 'Vogal_A', 'Imagens', imageName); 

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("Imagem não encontrada:", imageName);
            res.status(404).send('Imagem não encontrada.');
        } else {
            res.sendFile(imagePath);
        }
    });
});

// Servir áudio com base no parâmetro de consulta (query parameter)
app.get('/api/get-audio', (req, res) => {
    const audioName = req.query.audioName; // Nome do áudio
    if (!audioName) {
        return res.status(400).send('Parâmetro audioName não fornecido.');
    }

    const audioPath = path.join(__dirname, 'Vogal_A', 'Audios', audioName); 

    fs.access(audioPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("Áudio não encontrado:", audioName);
            res.status(404).send('Áudio não encontrado.');
        } else {
            res.sendFile(audioPath);
        }
    });
});


// // Servir o arquivo JSON `word.json`
// app.get('/api/get-json', (req, res) => {
//     const jsonPath = path.join(__dirname, 'Vogal_A', 'words.json');

//     fs.readFile(jsonPath, 'utf8', (err, data) => {
//         if (err) {
//             console.error("Erro ao ler o arquivo JSON:", err);
//             return res.status(500).send('Erro ao carregar o arquivo JSON.');
//         }
//         try {
//             const jsonData = JSON.parse(data); // Parse do JSON
//             res.json(jsonData); // Envia o JSON como resposta
//         } catch (parseErr) {
//             console.error("Erro ao parsear o JSON:", parseErr);
//             res.status(500).send('Erro ao processar o arquivo JSON.');
//         }
//     });
// });

// Iniciar o servidor HTTPS na porta 8080
https.createServer(options, app).listen(8080, () => {
    console.log('Servidor HTTPS rodando em https://localhost:8080/jogoExportado\n');
    console.log('Servidor HTTPS rodando em https://localhost:8080/Teste\n');
});
