const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());  // Menambahkan CORS middleware
app.use(express.json());

let qrCodeData = '';  // Variabel untuk menyimpan QR code sementara

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrCodeData = qr;  // Menyimpan QR code saat diterima
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
    qrCodeData = '';  // Kosongkan QR code saat klien siap
});

client.initialize();

// Endpoint untuk mengambil QR code
app.get('/get-qr', (req, res) => {
    if (qrCodeData) {
        res.status(200).json({ qr: qrCodeData });
    } else {
        res.status(200).json({ qr: null });
    }
});

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;

    client.sendMessage(`${number}@c.us`, message)
        .then(response => res.status(200).json({ status: 'success', response }))
        .catch(err => res.status(500).json({ status: 'error', err }));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
