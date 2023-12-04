"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_handlebars_1 = require("express-handlebars");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || "5000";
const app = (0, express_1.default)();
const router = express_1.default.Router();
const appName = 'YT Link Generator';
const hbs = (0, express_handlebars_1.create)({
    layoutsDir: path_1.default.join(process.cwd(), `views`),
    defaultLayout: false
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
// Require static assets from public folder
app.use(express_1.default.static(path_1.default.join(process.cwd(), `public`)));
app.engine('html', hbs.engine);
app.set('view engine', 'html');
// router area
router.get('/', (req, res) => {
    return res.render('index.html', {
        appName
    });
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = (_a = req.body) === null || _a === void 0 ? void 0 : _a.url;
    if (url) {
        if (ytdl_core_1.default.validateURL(url)) {
            try {
                let info = yield ytdl_core_1.default.getInfo(url);
                if (info === null || info === void 0 ? void 0 : info.formats) {
                    const links = new Array();
                    info === null || info === void 0 ? void 0 : info.formats.forEach((v, i) => {
                        var _a;
                        let label = `${v === null || v === void 0 ? void 0 : v.qualityLabel} (${v.container})`;
                        if (!(v === null || v === void 0 ? void 0 : v.qualityLabel)) {
                            label = `Audio only ${v === null || v === void 0 ? void 0 : v.audioBitrate} (${v.container})`;
                        }
                        links.push({
                            label,
                            title: (_a = info === null || info === void 0 ? void 0 : info.videoDetails) === null || _a === void 0 ? void 0 : _a.title,
                            hasAudio: v.hasAudio,
                            link: v.url
                        });
                    });
                    return res.json({
                        message: "video found!",
                        links
                    });
                }
                else {
                    return res.status(500).json({
                        message: "Video Unavailable."
                    });
                }
            }
            catch (e) {
                return res.status(500).json({
                    message: e.toString()
                });
            }
        }
        else {
            return res.status(500).json({
                message: "Your link is invalid."
            });
        }
    }
    else {
        return res.status(500).json({
            message: "Please fill form link."
        });
    }
}));
app.use(router);
app.listen(PORT, function (err) {
    if (err)
        console.log(err);
    console.log("Server listening on PORT", PORT);
});
exports.default = app;
//# sourceMappingURL=index.js.map