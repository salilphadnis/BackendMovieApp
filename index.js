import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"

const MongoClient = mongodb.MongoClient
const mongo_username = "salilaphadnis"
const mongo_password = "raveena123"
const uri = `mongodb+srv://salilaphadnis:raveena123@cluster0.so9ca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const port = 8000

//Connect to MongoDB

MongoClient.connect(
  uri,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await ReviewsDAO.injectDB(client); //send DB connection to DAO 
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    });
  })
