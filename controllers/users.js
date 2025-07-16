import express from 'express'
import Movie from '../models/movie.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.get('/profile',isSignedIn, async (req, res, next)=>{
    try {
        const loggedInUser = req.session.user._id
        const moviesOwned = await Movie.find({
            owner: loggedInUser
        })

        const likedMovies = await Movie.find({
            likedByUsers: loggedInUser
        })

        return res.render('users/profile.ejs', {
            moviesOwned,
            likedMovies
        })
    } catch (error) {
        next(error)
    }
})


export default router