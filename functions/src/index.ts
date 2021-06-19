import * as express from "express";
import * as functions from "firebase-functions";

import {pingAsync, pingOnlineAsync} from "./mc-ping";
import {playerIconAsync, serverIconAsync} from "./icon";

const app: express.Express = express();
// eslint-disable-next-line new-cap
const router: express.Router = express.Router();

app.use(router);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

exports.app = functions.https.onRequest(app);


// --- Get Operational Status --------------------------------------------------

router.get("/status", (req: express.Request, res: express.Response) =>
  pingAsync(req.query.host as string, parseInt(req.query.port as string))
      .then((result) =>
        res.json({
          success: true,
          data: result,
        }))
      .catch((err) => {
        console.log("[Get Operational Status] " + err);
        res.status(500).json({
          success: false,
          msg: err,
        });
      }));

// -----------------------------------------------------------------------------


// --- Get Online Member -------------------------------------------------------

router.get("/status/online", (req: express.Request, res: express.Response) =>
  pingOnlineAsync(req.query.host as string, parseInt(req.query.port as string))
      .then((result) =>
        res.json({
          success: true,
          data: result,
        }))
      .catch((err) => {
        console.log("[Get Online Member] " + err);
        res.status(500).json({
          success: false,
          msg: err,
        });
      }));

// -----------------------------------------------------------------------------


// --- Get Server Icon ---------------------------------------------------------

router.get("/icon/server", (req: express.Request, res: express.Response) =>
  serverIconAsync(req.query.host as string, parseInt(req.query.port as string))
      .then((result) => {
        res.writeHead(200, {
          "Content-Type": "image/png; charset=utf-8",
          "Content-Length": result.length,
        });
        res.end(result, "binary");
      })
      .catch((err) => {
        console.log("[Get Server Icon] " + err);
        res.status(500).json({
          success: false,
          msg: err,
        });
      }));

// -----------------------------------------------------------------------------


// --- Get Player Icon ---------------------------------------------------------
router.get("/icon/player", (req: express.Request, res: express.Response) =>
  playerIconAsync(req.query.minecraft_id as string)
      .then((img) => {
        res.writeHead(200, {
          "Content-Type": "image/png; charset=utf-8",
          "Content-Length": img.length,
        });
        res.end(img, "binary");
      })
      .catch((err) => {
        console.log("[Get Player Icon] " + err);
        res.status(500).json({
          success: false,
          msg: err,
        });
      }));

// -----------------------------------------------------------------------------
