export default (srv) => {
  srv.before('CREATE', 'Movies', (req) => {
    if (typeof req.data.cast === 'string') {
      try { req.data.cast = JSON.parse(req.data.cast) } catch (e) { }
    }
    if (req.data.cast && !Array.isArray(req.data.cast)) {
      req.reject(400, '`cast` must be an array of strings');
    }
  });

  const { Movies, Reviews } = this.entities;
  srv.on('READ', Movies, async (req, next) => {
    const movies = await next();

    for (let movie of movies) {
      const reviews = await SELECT.from(Reviews).where({ movie_ID: movie.ID });
      if (reviews.length > 0) {
        const total = reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0);
        movie.avgRating = (total / reviews.length).toFixed(2);
      } else {
        movie.avgRating = null;
      }
    }

    return movies;
  });
};