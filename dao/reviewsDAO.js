import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

  static async injectDB(conn) {

    //if already connected to reviews db, nothing to be done
    if (reviews) {
      return;
    }
    try {
      //DB reviews, collection reviews
      reviews = await conn.db("reviews").collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addReview(movieId, user, review) {
    try {
      //build key-value pairs
      const reviewDoc = {
        movieId: movieId,
        user: user,
        review: review,
      };

      //insert into DB, await till done
      //inertOne is a MongoDB command
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return {error: e};
    }
  }

  static async getReview(reviewId) {
    try {

      console.log("reviewId is ", reviewId);
      //convert reviewId to ObjectId and send to MongoDB
      return await reviews.findOne({_id: new ObjectId(reviewId)});
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return {error: e};
    }
  }

  static async updateReview(reviewId, user, review) {
    try {

      console.log("In updateReview");

      const updateResponse = await reviews.updateOne(
        {_id: new ObjectId(reviewId)},
        { $set: {user: user, review: review}}
      )

      return updateResponse;
    } catch (e) {
        console.error(`Unable to update review: ${e}`);
        return {error: e};
    }
  }

  static async deleteReview(reviewId) {

    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
      });
      return deleteResponse;
    }  catch (e) {
      console.error(`Unable to update review: ${e}`);
      return {error: e};
    }
  }

  static async getReviewsByMovieId(movieId) {
    try {
      //get list of documents matching movieId
      const cursor = await reviews.find({movieId: parseInt(movieId)});
      return cursor.toArray();  //convert to array
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return {error: e};
    }
  }

}