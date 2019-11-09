const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: 'http://localhost:5002',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  );
  app.use(
    proxy('/download', {
      target: 'http://localhost:5002',
      changeOrigin: true
    })
  );
};
