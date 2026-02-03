require('dotenv').config();

const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];
  return value !== undefined ? value : defaultValue;
};

const dbConfig = {
  HOST: getEnvVar('DB_HOST', ''),
  DB: getEnvVar('DB_DB', ''),
  PORT: getEnvVar('DB_PORT', ''),
  USER: getEnvVar('DB_USER', ''),
  PASSWORD: getEnvVar('DB_PASSWORD', ''),
};

const configs = {
  PORT: getEnvVar('PORT', 8000),
  DB: dbConfig,
  JWT_SECRET: getEnvVar('JWT_SECRET', ''),
}

module.exports = configs;