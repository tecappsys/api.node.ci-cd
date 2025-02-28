const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const PORT = 9000;
const SECRET = process.env.WEBHOOK_SECRET; // Mismo secret configurado en GitHub

app.use(express.json());

app.post("/webhook", (req, res) => {
    const sig = `sha256=${crypto.createHmac("sha256", SECRET).update(JSON.stringify(req.body)).digest("hex")}`;
    if (req.headers["x-hub-signature-256"] !== sig) {
        return res.status(401).send("Invalid signature");
    }

    const repo = req.body.repository.name;
    console.log(`Recibido Webhook para ${repo}`);

    let commands = {
        "app.portal": "cd /var/www/tecappsys/portfolio/home/app.portal && git pull && npm install && npm run build",
        // "api.node.mongo": "cd /var/www/tecappsys/api.node.mongo && git pull && npm install && pm2 restart api",
        // "app.angular.resume": "cd /var/www/tecappsys/portfolio/angular/resume && git pull && npm install && npm run build",
        // "app.react.portal": "cd /var/www/tecappsys/portfolio/react/portal && git pull && npm install && npm run build",
        // "app.portal": "cd /var/www/tecappsys/portfolio && git pull && npm install && npm run build",
        // "app.angular.portal": "cd /var/www/tecappsys/portfolio/angular/portal && git pull && npm install && npm run build",
        // "app.angular.spotify": "cd /var/www/tecappsys/portfolio/angular/spotify && git pull && npm install && npm run build",
        // "app.angular.spa": "cd /var/www/tecappsys/portfolio/angular/spa && git pull && npm install && npm run build"
    };

    if (commands[repo]) {
        exec(commands[repo], (err, stdout, stderr) => {
            if (err) {
                console.error(`Error ejecutando el despliegue para ${repo}:`, stderr);
                return res.status(500).send(stderr);
            }
            console.log(`Despliegue completado para ${repo}:`, stdout);
            res.send("Despliegue exitoso");
        });
    } else {
        res.status(400).send("Repositorio no registrado");
    }
});

app.listen(PORT, () => console.log(`Webhook listener corriendo en puerto ${PORT}`));