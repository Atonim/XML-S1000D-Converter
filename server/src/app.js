import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.post('/getResults', (req, res) => {
  res.send({
    message: 'Your file was successfully converted!'
  })
})

app.listen(process.env.PORT || 8085);