const express = require('express');
const cors = require('cors');
const sequelize = require('./config/dbconfig');
const User = require('./model/user-model');
const InterestCategory = require('./model/interest-category-model');
const auth = require('./routes/auth-router');
const UserInterest = require('./model/user-interest-model');
const interestCategoryRouter = require('./routes/interest-category-router');
const postRouter = require('./routes/post-router');
const app = express();
app.use(cors());
app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use('/auth', auth)
app.use('/interest-categories', interestCategoryRouter)
app.use('/posts', postRouter)
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.listen(5000, () => {
  console.log("Server running on PORT: 5000");
});
