import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorhandler from './app/middlwares/globalErrorhandler';
import router from './app/routes';
import notFound from './app/middlwares/notFound';
const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/v1', router);

/* app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/users', UserRouters); */

//test route
app.get('/', (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
});

//global error handling middleware
app.use(globalErrorhandler);

//not found route
app.use(notFound);

export default app;
