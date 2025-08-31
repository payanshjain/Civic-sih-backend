const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

// --- START: CORS Configuration ---
// Define the allowed origins (your frontend URLs)
const allowedOrigins = [
  'https://civicsync-resolve.vercel.app',
  'https://civicsync-resolve-payanshs-projects-d9aeaeda.vercel.app',
  'https://civicsync-resolve-msikgayu9-payanshs-projects-d9aeaeda.vercel.app',
  'http://localhost:8080' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
// --- END: CORS Configuration ---

// Admin User Seeding Logic
const seedAdminUser = async () => {
  try {
    const adminEmail = 'om@gmail.com';
    if (!(await User.findOne({ email: adminEmail }))) {
      const hashedPassword = await bcrypt.hash('omjain', 10);
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

// Use the detailed CORS options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
  res.send('CivicSync API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));