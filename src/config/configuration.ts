export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  }
});

// DB_HOST=postgres
// DB_PORT=5432
// DB_NAME=products_db
// DB_USER=postgres
// DB_PASSWORD=db_password