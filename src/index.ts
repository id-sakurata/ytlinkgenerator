import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {create} from 'express-handlebars';
import fileUpload from 'express-fileupload';
import ytdl from 'ytdl-core';
import path from 'path';

const PORT:string = process.env.PORT || "5000"; 
const app = express();
const router = express.Router();
const appName: string = 'YT Link Generator';

const hbs = create({
    layoutsDir: path.join(process.cwd(), `views`),
    defaultLayout: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(fileUpload());
// Require static assets from public folder
app.use(express.static( path.join(process.cwd(), `public`) ));

app.engine('html', hbs.engine);
app.set('view engine', 'html');

// router area

router.get('/', (req: Request, res: Response) => {
    return res.render('index.html', {
        appName
    });
});

router.post("/", async (req: Request, res: Response) => {
    const url: string = req.body?.url;
    if(url) {
        if(ytdl.validateURL(url)) {
            try {
                let info = await ytdl.getInfo(url);
                if(info?.formats) {
                    const links: Array<Object> = new Array();
                    info?.formats.forEach((v, i) => {
                        let label: String = `${v?.qualityLabel} (${v.container})`;
                        if(!v?.qualityLabel) {
                            label = `Audio only ${v?.audioBitrate} (${v.container})`;
                        }
                        links.push({
                            label,
                            title: info?.videoDetails?.title,
                            hasAudio: v.hasAudio,
                            link: v.url
                        })
                    });
                    return res.json({
                        message: "video found!",
                        links
                    });
                } else {
                    return res.status(500).json({
                        message: "Video Unavailable."
                    });
                }
            } catch(e: any) {
                return res.status(500).json({
                    message: e.toString()
                });
            }
        } else {
            return res.status(500).json({
                message: "Your link is invalid."
            });
        }
    } else {
        return res.status(500).json({
            message: "Please fill form link."
        });
    }
});

app.use(router);
app.listen(PORT, function (err?: String): void {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

export default app;