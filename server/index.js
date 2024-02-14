// index.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const twitterClient = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
});

app.post('/tweet', async (req, res) => {
  const tweetText = req.body.tweet;

  try {
    const tweetResponse = await twitterClient.v2.tweet(tweetText);
    console.log('Tweet posted successfully:', tweetResponse.data);
    res.status(200).json({ success: true, message: 'Tweet posted successfully!' });
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).json({ success: false, message: 'Error posting tweet.' });
  }
});

// Serve the static files for the React app
app.use(express.static(new URL('client/build', import.meta.url).pathname));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
