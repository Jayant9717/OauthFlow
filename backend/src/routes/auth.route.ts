// import express from "express";
// import { authRoute, oauthCallback } from "../controller/auth.controller";

// const routerStart = express.Router();

// routerStart.get("/install", authRoute);
// routerStart.get("/oauthcallback", oauthCallback);

// export default routerStart;
import { Router } from "express";
import OAuthController from "../controller/auth.controller";

const router = Router();

router.get("/install", (req, res) => OAuthController.authRoute(req, res));
router.get("/oauthcallback", (req, res) =>
  OAuthController.oauthCallback(req, res)
);

export default router;
