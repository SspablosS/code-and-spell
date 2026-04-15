import winston from "winston";

const { combine, timestamp, errors, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  const base = `${ts} ${level}: ${message}`;
  return stack ? `${base}\n${stack}` : base;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels: winston.config.npm.levels,
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), errors({ stack: true }), logFormat)
    })
  ]
});

