const express = require('express');
const path = require('path');
const { chatSession } = require('./index'); // Ensure this path is correct

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat route
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;
    try {
        const result = await chatSession.sendMessage(userInput);
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: 'Sorry, something went wrong.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
