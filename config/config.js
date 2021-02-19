require('dotenv').config();

// console.log(process.env)

const config = {
  env:process.env.NODE_ENV,
  port:process.env.PORT,
  mongo:{
    host:process.env.MONGO_HOST,
    port:process.env.MONGO_PORT
  }
}

module.exports = config;