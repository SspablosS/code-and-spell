import { logger } from "./config/logger";
import { env } from "./config/env";
import app from "./app";

const HOST = "0.0.0.0";
const PORT = env.PORT;

app.listen(PORT, HOST, () => {
  logger.info(`Server started on http://${HOST}:${PORT}`);
});

