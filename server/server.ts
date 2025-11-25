import express, {type Request, type Response, type Router} from 'express';

const app = express();

app.use(express.json());

const apiRouter: Router = express.Router()

apiRouter.get('/', (req: Request, res: Response) => {
  res.send('API index')
})

apiRouter.get('/1', (req: Request, res: Response) => {
  res.send('API route 1')
})

// app.get('/api', (req: Request, res: Response) => {
//   res.json({ message: 'Hello from Express!' });
// });

app.use('/api', apiRouter)

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001');
});
