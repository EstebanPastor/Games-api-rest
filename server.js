const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})