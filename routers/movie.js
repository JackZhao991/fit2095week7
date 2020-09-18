var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);

            res.json();
        });
    },

    removeActor: function (req, res) {
        Movie.findOne({_id: req.params.movieId}, function (err, movie) {
            if (!err) {
                for (let i = 0; i < movie.actors.length; i++) {
                    if (movie.actors[i] == req.params.actorId) {
                        movie.actors.splice(i, 1);
                        movie.save(function (err) {
                            if (err) return res.status(500).json(err);
                        });
                    }
                }
                res.json(movie);
            } else {
                res.status(400).json(err);
            }
        });
    },

    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(movie);
                });
            });
        });
    },

    getMovies: function (req, res) {
        Movie.where('year').gte(req.params.year1).lte(req.params.year2).exec(function (err, movies) {
            if (!err) 
            res.json(movies);
            else 
            res.status(400).json(err);
        });
    },

    deleteMovies: function (req, res) {
        Movie.deleteMany({'year': {$gte: req.body.year1, $lte: req.body.year2}}, function(err, result) {
            if (!err)
            res.json(result);
            else
            status(400).json(err);
        });
    },
};