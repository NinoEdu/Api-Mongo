const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// Habilitar CORS para todas as origens
app.use(cors());

// Conecta com mongo.js
const exportData = require('./mongo');

//rodar threads do Godot
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

// Middleware para servir pastas fixas
app.use('/Teste', express.static(path.join(__dirname, 'Teste')));
app.use('/teste2', express.static(path.join(__dirname, 'teste2')));
app.use('/Teste_Acerte_A_Silaba', express.static(path.join(__dirname, 'Teste_Acerte_A_Silaba')));

// Endpoint para servir dados do MongoDB
app.get('/api/get-json', async (req, res) => {
    try {
        const json_data = await exportData(); // Supondo que exportData retorne um JSON válido
        res.json(json_data);
    } catch (err) {
        console.error("Erro no endpoint /api/get-json:", err);
        res.status(500).json({ error: "Erro ao obter dados do servidor." });
    }
});

// Endpoint dinâmico para servir imagens e áudios
app.get('/api/:vogal/:fileType', (req, res) => {
    const { vogal, fileType } = req.params; // Exemplo: vogal = "Vogal_A", fileType = "Imagens"
    const fileName = req.query.fileName; // Nome do arquivo (e.g., A_Aviao_Foto_1.png)

    if (!fileName) {
        return res.status(400).send('Parâmetro fileName não fornecido.');
    }

    const filePath = path.join(__dirname, vogal, fileType, fileName);

    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`${fileType} não encontrado:`, filePath);
            return res.status(404).send(`${fileType} não encontrado.`);
        }
        res.sendFile(filePath);
    });
});

const PORT = 8080;

http.createServer(app).listen(PORT, () => {
    console.log(`Servidor HTTP iniciado`);
    console.log('Servidor HTTP rodando em http://localhost:8080/Teste');
});