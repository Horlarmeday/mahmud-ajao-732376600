import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerService } from '@nestjs/common';
import * as os from 'os';
import * as cluster from 'cluster';
const thisCluster = cluster as any as cluster.Cluster;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: LoggerService = new Logger();
  const port = process.env.PORT;
  const numCPUs = os.cpus().length;

  if (thisCluster.isPrimary) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      thisCluster.fork();
    }

    thisCluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    await app.listen(port, () => {
      logger.log(`Server running on port ${port}`);
    });
  }
}
bootstrap();
