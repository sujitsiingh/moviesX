export default (srv) => {
  srv.before('CREATE', 'Movies', (req) => {
    if (typeof req.data.cast === 'string') {
      try { req.data.cast = JSON.parse(req.data.cast) } catch (e) { /* ignore */ }
    }
    if (req.data.cast && !Array.isArray(req.data.cast)) {
      req.reject(400, '`cast` must be an array of strings');
    }
  });
};