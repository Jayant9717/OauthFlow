// import express from "express";
// import { displayData, RefreshTokenApi } from "../controller/display.controller";

// const routerDisplay = express.Router();

// routerDisplay.get("/contact", displayData);
// routerDisplay.post("/refreshtoken", RefreshTokenApi);

// export default routerDisplay;
import { Router } from "express";
import TokenManager from "../controller/display.controller"; // Adjust the path as necessary

const router = Router();

router.get("/contact", (req, res) => TokenManager.displayData(req, res));
router.get("/refreshtoken", (req, res) =>
  TokenManager.refreshTokenApi(req, res)
);

export default router;
