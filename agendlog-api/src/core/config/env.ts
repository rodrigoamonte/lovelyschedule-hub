import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Variável de ambiente ${key} não definida!`);
  }
  return value;
};

export const env = {
  PORT: Number(getEnv("PORT", "3000")),
  API_VERSION: getEnv("API_VERSION", "v1"),
  ENVIRONMENT: getEnv("ENVIRONMENT", "development"),
  JWT_SECRET: getEnv("JWT_SECRET", "default_secret"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1h"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "5d"),
};
