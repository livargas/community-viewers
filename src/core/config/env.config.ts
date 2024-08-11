export const EnvConfig = () => ({
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "community_viewers",
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || "root",
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD || "root",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,
  PASSPORT_PRIVATE_KEY: process.env.PASSPORT_PRIVATE_KEY || "private.pem",
  PASSPORT_PUBLIC_KEY: process.env.PASSPORT_PUBLIC_KEY || "public.pem",
});
