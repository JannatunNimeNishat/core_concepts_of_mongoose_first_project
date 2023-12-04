 import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import {Server} from 'http';

let server:Server;


async function main() {
  try {
    await mongoose.connect(config.database_url as string);

   server =  app.listen(config.port, () => {
      console.log(`server is running at port:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

//handling unhandledRejection error
process.on('unhandledRejection', ()=>{
  console.log('unhandledRejection is detected, shutting down ... ');
  if(server){
    server.close(()=>{
      process.exit(1);
    })
  }
  process.exit(1);
})
