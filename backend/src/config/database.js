module.exports = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};