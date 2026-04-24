import { logger } from "./config/logger";
import { env } from "./config/env";
import app from "./app";

app.listen(env.PORT, () => {
  logger.info(`Server started on port ${env.PORT}`);
});

