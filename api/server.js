// Dependencies
const api = require('./api');
const mongoose = require('mongoose');

require('dotenv').config()

const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => { console.log('MongoDB connected') })
.catch((err) => { console.log(err) });


// Start the server
const PORT = process.env.PORT || 80;
api.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});