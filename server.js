const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/blog') {
    const page = parseInt(req.query._page, 10) || 1;
    const perPage = parseInt(req.query._per_page, 10) || 10;

    const start = (page - 1) * perPage;
    const end = start + perPage;

    const data = router.db.get('blog').value();

    const paginatedData = data.slice(start, end);

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / perPage);

    const response = {
      first: 1,
      prev: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null,
      last: totalPages,
      pages: totalPages,
      items: totalItems,
      data: paginatedData,
    };

    res.json(response);
  } else {
    next();
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
