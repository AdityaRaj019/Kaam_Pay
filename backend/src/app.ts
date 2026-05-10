import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index';


const app: Express = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);


app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});



export default app;
