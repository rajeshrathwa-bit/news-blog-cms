require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Category = require('./models/Category');
const News = require('./models/News');
const Comment = require('./models/Comment');
const Setting = require('./models/Setting');

const uploadsDir = path.join(__dirname, '../client/public/uploads');

// Tiny valid 1x1 JPEG used as a placeholder article image so seeds have no broken files.
const PLACEHOLDER_JPEG =
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==';

function writePlaceholderImage(filename) {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const file = path.join(uploadsDir, filename);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, Buffer.from(PLACEHOLDER_JPEG, 'base64'));
  }
  return filename;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to database: ${mongoose.connection.name}`);

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    News.deleteMany({}),
    Comment.deleteMany({}),
    Setting.deleteMany({}),
  ]);
  console.log('Old data cleared.');

  const setting = await Setting.create({
    website_title: 'My News Portal',
    footer_description: 'Your trusted source for daily news.',
  });

  const admin = await User.create({
    fullname: 'Super Admin',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  });
  const author = await User.create({
    fullname: 'Rahul Sharma',
    username: 'rahul',
    password: 'rahul123',
    role: 'author',
  });

  const sports = await Category.create({
    name: 'Sports',
    description: 'Cricket, football and all sports news.',
  });
  const technology = await Category.create({
    name: 'Technology',
    description: 'Science, gadgets and the latest tech.',
  });
  const business = await Category.create({
    name: 'Business',
    description: 'Markets, economy and company news.',
  });

  const img1 = writePlaceholderImage('seed-cricket.jpg');
  const img2 = writePlaceholderImage('seed-phone.jpg');
  const img3 = writePlaceholderImage('seed-markets.jpg');
  const img4 = writePlaceholderImage('seed-rain.jpg');

  const article1 = await News.create({
    title: 'India Wins Cricket Final',
    content:
      '<p>India won a thrilling final decided on the very last ball.</p><p>The crowd at the stadium erupted as the winning run was scored.</p>',
    category: sports._id,
    author: author._id,
    image: img1,
  });
  await News.create({
    title: 'New Smartphone Launched',
    content:
      '<p>A leading brand launched a new smartphone with a bigger battery and an improved camera.</p>',
    category: technology._id,
    author: admin._id,
    image: img2,
  });
  await News.create({
    title: 'Markets Rally on Positive Data',
    content:
      '<p>Stock markets rallied today after better-than-expected economic data was released.</p>',
    category: business._id,
    author: admin._id,
    image: img3,
  });
  await News.create({
    title: 'Rain Forecast for Tomorrow',
    content:
      '<p>Forecasters expect heavy showers across the region starting tomorrow evening.</p>',
    category: sports._id,
    author: author._id,
    image: img4,
  });

  await Comment.create([
    {
      article: article1._id,
      name: 'Priya',
      email: 'priya@example.com',
      content: 'Great article, very informative!',
      status: 'approved',
    },
    {
      article: article1._id,
      name: 'Bob',
      email: 'bob@example.com',
      content: 'Needs more details about the final over.',
      status: 'pending',
    },
  ]);

  console.log('Seed completed successfully!\n');
  console.log('Roles & login credentials');
  console.log('-------------------------');
  console.log('Admin : admin  / admin123');
  console.log('Author: rahul  / rahul123');
  console.log('');
  console.log('Data inserted');
  console.log('-------------');
  console.log(`  Settings   : ${setting.website_title}`);
  console.log(`  Users      : 2 (${admin.username}, ${author.username})`);
  console.log(`  Categories : ${[sports.name, technology.name, business.name].join(', ')}`);
  console.log(`  Articles   : 4`);
  console.log(`  Comments   : 2 (1 approved, 1 pending)`);
  console.log('');
  console.log('Public site : http://localhost:5173');
  console.log('Admin login : http://localhost:5173/admin/login');

  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exit(1);
  });