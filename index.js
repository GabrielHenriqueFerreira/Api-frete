const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3220;

const API_KEY = process.env.API_KEY; // Use variáveis de ambiente

// Configura o CORS para permitir requisições do frontend
app.use(cors({
    origin: '*', // Permite todas as origens (ou substitua '*' pela URL do seu frontend)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para calcular o frete
app.post('/calcular-frete', async (req, res) => {
    const { cepDestino, cepOrigem, peso, altura, largura, comprimento } = req.body;

    console.log('Dados recebidos:', {
        cepDestino,
        cepOrigem,
        peso,
        altura,
        largura,
        comprimento,
    });

    try {
        const response = await axios.post(
            'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate',
            {
                from: { postal_code: cepOrigem },
                to: { postal_code: cepDestino },
                package: {
                    weight: peso,
                    height: altura,
                    width: largura,
                    length: comprimento,
                },
                options: {
                    insurance_value: 0,
                    receipt: false,
                    own_hand: false,
                },
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Aplicação (gabriel06henrique06@gmail.com)',
                },
            }
        );

        console.log('Resposta da API do Melhor Envio:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao calcular frete:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao calcular frete', details: error.response ? error.response.data : error.message });
    }
});

const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

server.setMaxListeners(20);
