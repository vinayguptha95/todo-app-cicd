module.exports = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://mongodb-service:27017/todoapp',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};