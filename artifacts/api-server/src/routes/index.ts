import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import clientesRouter from "./clientes";
import produtosRouter from "./produtos";
import producaoRouter from "./producao";
import dashboardRouter from "./dashboard";
import precosRouter from "./precos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(clientesRouter);
router.use(produtosRouter);
router.use(producaoRouter);
router.use(dashboardRouter);
router.use(precosRouter);

export default router;
