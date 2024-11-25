import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
    try {
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US')
        const ramdomMovie = data.results[Math.floor(Math.random() * data.results.length)]

        res.json({
            success: true,
            content: ramdomMovie
        })
    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export async function getMovieTrailers(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`)

        res.json({
            success: true,
            trailers: data.results
        })

    } catch (error) {
        console.log("error in logout controller", error.message)
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export async function getMovieDetails(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`)

        res.json({
            success: true,
            content: data
        })

    } catch (error) {
        console.log("error in logout controller", error.message)
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export async function getSimilarMovies(req, res) {
    const { id } = req.params;

    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`)

        res.json({
            success: true,
            similar: data.results
        })

    } catch (error) {
        console.log("error in logout controller", error.message)
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export async function getMoviesByCategory(req, res) {
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`)

        res.json({
            success: true,
            content: data.results
        })
    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}