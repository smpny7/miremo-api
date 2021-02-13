import * as express from "express";
import * as functions from "firebase-functions";
import * as fs from "fs";

if (!fs.existsSync("cache")) fs.mkdirSync("cache");

import {pingAsync, pingOnlineAsync} from "./mc-ping";

const app: express.Express = express();
const router: express.Router = express.Router();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(router);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

exports.app = functions.https.onRequest(app);


// --- Get Operational Status --------------------------------------------------

router.get("/status", (req: express.Request, res: express.Response) => {
    pingAsync(req.query.host as string, parseInt(req.query.port as string))
        .then(result => {
            res.json({
                success: true,
                data: result,
            });
        })
        .catch(err => {
            console.log("[Get Operational Status] " + err);
            res.status(500).json({
                success: false,
                msg: err,
            });
        });
});

// -----------------------------------------------------------------------------


// --- Get Online Member -------------------------------------------------------

router.get("/status/online", (req: express.Request, res: express.Response) => {
    pingOnlineAsync(req.query.host as string, parseInt(req.query.port as string))
        .then(result => {
            res.json({
                success: true,
                data: result,
            });
        })
        .catch(err => {
            console.log("[Get Online Member] " + err);
            res.status(500).json({
                success: false,
                msg: err,
            });
        });
});

// -----------------------------------------------------------------------------
