import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title:{type: String, required: true},
    director: {type: String, required: true},
    releaseYear: {type: Number, required: true},
    genre: {type: String, required: true},
    review: {type: String, required: true},
    rating: {type: Number, min:0, max: 100},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',},],
})

const Movie = mongoose.model('Movie', movieSchema)

export default Movie