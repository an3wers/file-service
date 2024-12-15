import express from "express";
import { config } from "./config";
// import { fileRoutes } from './routes/fileRoutes';
// import { bindRoutes } from './routes/bindRoutes';

const app = express();

// app.use(express.json());
// app.use('/api/files', fileRoutes);
// app.use('/api/binds', bindRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
