import express from 'express'
import Movie from '../models/movie.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.get('/', async (req, res, next)=>{
    try {
        const movies = await Movie.find().populate('owner')
        return res.render ('movieViews/movieList.ejs', {allMovies: movies})
    } catch (error) {
        next(error)
    }
})

router.get('/new', isSignedIn, (req,res, next) =>{
    try {
        return res.render('movieViews/new.ejs')
    } catch (error) {
        next(error)
    }
    
})

router.post('/', isSignedIn, async (req, res, next) =>{
    try{
        req.body.owner = req.session.user._id;
        const newMovie = await Movie.create(req.body)
        return res.redirect(`/movies/${newMovie._id}`)
    }catch(error){
        next(error)
    }
})

router.get('/:movieId', isSignedIn, async (req, res, next)=>{
    try {
        const {movieId} = req.params
        const movie = await Movie.findById(movieId).populate('owner')
        return res.render ('movieViews/showMovie.ejs', {movie})
    } catch (error) {
        next(error)
    }
})


router.delete('/:movieId', isSignedIn, async (req, res, next)=>{
    try {
        const movie = await Movie.findById(req.params.movieId)
        if(movie.owner.equals(req.session.user._id)){
            await movie.deleteOne()
            res.redirect("/movies")
        } else {
            res.send("You don't have permission to do that.");
        }
    } catch (error) {
        next(error)
    }
})

router.get('/:movieId/edit', isSignedIn, async (req, res, next)=>{
    try {
        const movie = await Movie.findById(req.params.movieId).populate('owner')
        res.render('movieViews/editMovie.ejs', {movie})
    } catch (error) {
        next(error)
    }
})

router.put('/:movieId', isSignedIn, async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (movie.owner.equals(req.session.user._id)) {
        await movie.updateOne(req.body);
        res.redirect('/movies');
    } else {
        res.send("You don't have permission to do that.")
    }
  } catch (error) {
    next(error)
  }
});



export default router