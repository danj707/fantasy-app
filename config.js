exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://localhost/fantasy-app' :
                            'mongodb://localhost/fantasy-app-dev');
exports.PORT = process.env.PORT || 5000;