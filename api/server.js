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
const port = process.env.PORT;
api.listen(port, () => {
    console.log(`Server running on port ${port}`);
});