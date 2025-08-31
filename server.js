const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User'); 

// Load environment variables
dotenv.config();

// --- START: Admin User Seeding ---
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
        phone: '0000000000', // Placeholder phone
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};
// --- END: Admin User Seeding ---

const app = express();

// --- Middleware ---
app.use(cors({
  origin: "https://civicsync-resolve-ydmd.vercel.app", // allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json()); // parse JSON bodies

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
  res.send('CivicSync API is running...');
});

// --- Start Server after DB connection ---
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    seedAdminUser(); // seed admin after DB connection
  });
}).catch(err => {
  console.error('❌ Failed to connect to DB:', err);
  process.exit(1);
});
