import express from 'express';
import bodyParser from 'body-parser';
import FileSaver from "file-saver";
import path from 'path'
import cors from 'cors';
import multer from 'multer'
import morgan from 'morgan';
import { startUnzip } from "./converter/jszip.js";

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false }));

const upload = multer({ dest: 'files/' });

app.post('/converter', upload.single('file'), (req, res) => {
  console.log(req.file)

  try {
    startUnzip(req.file).then(result => {
      console.log(result)
      res.append('Content-Type', 'application/zip');
      res.send(result)
    })
  } catch (err) {
    console.log(err);
  }
})

app.listen(process.env.PORT || 8085);