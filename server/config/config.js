// =============
// Port
// =============
process.env.PORT = process.env.PORT || 3000;

// =============
// Enviroment
// =============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============
// Token expiration date
// =============
process.env.TOKEN_EXPIRATION_DATE = '48h';

// =============
// Token Secret
// =============
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'Secret Develop';

// =============
// Database
// =============
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/shopDB';
} else {
    urlDB = process.env.MONGO_DB_URI;
}
process.env.URL_DB = urlDB;

// ====================
// Id de Cliente Google
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '883018089892-esh3di1in6bgkfsvclm6g4lkp2lecoif.apps.googleusercontent.com';


// ===============
// Cloudinary keys
// ===============
process.env.CLOUDINARY_CLOUD_NAME = 'dso7ibutm';
process.env.CLOUDINARY_API_KEY = 567183123373866;
process.env.CLOUDINARY_API_SECRET = 'nhS0iOSiSJUeP2tmu7DeT5PHeI0';