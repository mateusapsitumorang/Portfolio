const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Mengizinkan frontend React mengakses backend
app.use(express.json()); // Membaca data JSON dari React

// Rute Tes Server
app.get('/', (req, res) => {
    res.send("Backend Portfolio Berjalan Lancar!");
});

// Endpoint untuk menerima pesan dari Contact Form
app.post('/api/contact', (req, res) => {
    const { nama, pesan } = req.body;
    
    console.log(`[PESAN BARU] Dari: ${nama} | Pesan: ${pesan}`);
    
    // Di aplikasi nyata, di sini Anda bisa menambahkan kode untuk
    // menyimpan ke database (MongoDB/MySQL) atau mengirim email via Nodemailer
    
    res.status(200).json({ 
        success: true, 
        message: "Pesan Anda berhasil diterima oleh server!" 
    });
});

app.listen(PORT, () => {
    console.log(`Server Node.js berjalan di http://localhost:${PORT}`);
});