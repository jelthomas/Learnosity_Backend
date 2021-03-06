const {MongoClient} = require('mongodb');
const ATLAS_URI= "mongodb+srv://jelthomas:learnosity_proj@learnositydata.hvfbn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const user = require('../models/user.model');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db("TestCollection");
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a User into collection', async () => {
    const users = db.collection('users');

    const username = "Test Name";
    const email = "test@gmail.com";
    const password = "test_password";
    const security_question = "What was the name of your first pet?";
    const security_answer = "Rex";
    const created_platforms= [];
    const total_time_played = 0;
    const completed_categories = 0;
    const experience_points = 0;
    const favorited_platforms = [];

    const newUser = new user({
      username, 
      email,
      password,
      security_question,
      security_answer,
      created_platforms,
      total_time_played,
      completed_categories,
      experience_points,
      favorited_platforms
    });

    await users.insertOne(newUser);

    const insertedUser = await users.findOne({username:'test name'});
    // console.log(insertedUser)
    expect(insertedUser.username).toEqual(newUser.username);
  });
});