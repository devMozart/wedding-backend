import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/wedding';
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('Connected to DB'))
  .catch((err) => console.log('Could not connect to DB', err));
mongoose.Promise = Promise;

const Guest = mongoose.model('Guest', {
  primaryGuest: { type: String, required: true },
  isAttending: { type: Boolean, required: true },
  secondaryGuest: { type: String },
  information: { type: String },
  email: { type: String },
  telephone: { type: String },
  date: { type: Date },
});

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/guests', async (req, res) => {
  try {
    const guests = await Guest.find();
    res.status(200).json({
      response: {
        guests,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      response: {
        error,
      },
      success: false,
    });
  }
});

app.post('/guests', async (req, res) => {
  const {
    primaryGuest,
    secondaryGuest,
    information,
    email,
    telephone,
    isAttending,
  } = req.body;

  if (!primaryGuest || primaryGuest.length === 0) {
    res.status(400).json({
      response: {
        error: 'The primary guest cannot be empty',
      },
      success: false,
    });
  }

  try {
    const newGuest = new Guest({
      primaryGuest,
      isAttending,
      secondaryGuest,
      information,
      email,
      telephone,
      date: new Date(),
    });

    await newGuest.save();

    res.status(201).json({
      response: {
        guest: newGuest,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      response: {
        error,
      },
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
