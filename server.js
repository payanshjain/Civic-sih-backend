const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt
const User = require('./models/User'); // Import User model

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
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
// --- END: Admin User Seeding ---

// Connect to database
connectDB().then(() => {
  // Run the seeder after the DB connection is established
  seedAdminUser();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
  res.send('CivicSync API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));