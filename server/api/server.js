// Dependencies
const api = require('./api');
const mongoose = require('mongoose');

const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri)
.then(() => { console.log('MongoDB connected') })
.catch((err) => { console.log(err) });


// Start the server
const PORT = process.env.NODE_ENV === 'production' ? 80 : 5000;
api.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});