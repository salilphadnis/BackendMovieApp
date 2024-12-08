//Needed to access database
//controller will send info to DAO which will get data from database
import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {

  static async apiPostReview(req, res, next) {

    console.log("################# In Post Review #########");

    
    //get stuff from the incoming request
    try {
      const movieId = req.body.movieId;
      const review = req.body.review;
      const user = req.body.user;

      //Call addReview from the DAO and
      //wait for response from the DAO
      const reviewResponse = await ReviewsDAO.addReview(
        movieId,
        user,
        review
      ) 
      res.json({status: success});
    } catch (e) {
      res.status(500).json({error: e.message})
    }


  }

  static async apiGetReview(req, res, next) {

    console.log("### In Get Review ####");

    try {
      let id = req.params.id || {};
      let review = await ReviewsDAO.getReview(id);
      if (!review) {
        res.status(404).json({error: "Not found"});
        return;
      }
      res.json(review);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({error:e});
    }
  }

  static async apiUpdateReview(req, res, next) {

    //get stuff from the incoming request
    try {
      const reviewId = req.params.id;
      const review = req.body.review;
      const user = req.body.user;

      console.log("reviewId is: ", reviewId);
      console.log("review is: ", review);
      console.log("user is: ", user);

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        user,
        review
      );

      //Check for various ways that there could be an error from MongoDB
      var { error } = reviewResponse;
      if (error) {
        res.status(404).json({error});
      }

      //MongoDb says nothing was changed
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review"
        );
      }

      res.json({status: "success"});
    } catch (e) {
        res.status(500).json({error : e.message});
    }

  }

  static async apiDeleteReview(req, res, next) {

    try {
      const reviewId = req.params.id;
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
      res.json({status: "success"});      
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      //Movie ID
      let id = req.params.id || {};
      let reviews = await ReviewsDAO.getReviewsByMovieId(id);

      if (!reviews) {
        res.status(404).json({error: "Not found"});
        return;
      }
      res.json(reviews);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({error: e});
    }
  }


}