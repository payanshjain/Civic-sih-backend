const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// --- START: CORS Configuration ---
// Define the allowed origins (your frontend URLs)
const allowedOrigins = [
  'https://civicsync-resolve-ydmd.vercel.app',
  'http://localhost:8080' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
// --- END: CORS Configuration ---


// Admin User Seeding Logic (from previous step)
const seedAdminUser = async () => {
  try {
    const adminEmail = 'om@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const password = 'omjain';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        email: adminEmail,
        phone: '0000000000',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Connect to database and then seed admin
connectDB().then(() => {
  seedAdminUser();
});

const app = express();

// --- MODIFICATION: Use the detailed CORS options ---
app.use(cors(corsOptions));
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
  res.send('CivicSync API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));