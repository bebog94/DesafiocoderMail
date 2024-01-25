import { Router } from "express"
import { logger } from "../utils/logger.js"
const router = Router();

router.get('/', async (req, res) => {
    logger.fatal("Ejemplo de fatal")
    logger.error("Ejemplo de error")
    logger.warning("Ejemplo de warning")
    logger.info("Ejemplo de info")
    logger.http("Ejemplo de http")
    logger.debug("Ejemplo de debug")
})

export default router;