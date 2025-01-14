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

// Middleware para servir pastas fixas
app.use('/Teste', express.static(path.join(__dirname, 'Teste')));
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

// Iniciar o servidor HTTP na porta 8080
http.createServer(app).listen(8080, () => {
    console.log('Servidor HTTP rodando em http://localhost:8080/Teste');
});