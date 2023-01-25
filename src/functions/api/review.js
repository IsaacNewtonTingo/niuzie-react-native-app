import axios from "axios";

export async function addReview(userID, productID, rating, { reviewMessage }) {
  await axios
    .post(
      `https://cda3-105-163-156-62.in.ngrok.io/api/product/review-product/${productID}`,
      {
        userID,
        rating,
        reviewMessage,
      }
    )
    .then((response) => {
      const { message } = response.data.message;
      return message;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}
