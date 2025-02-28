require('dotenv').config();
const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const PORT = 9000;
const SECRET = process.env.WEBHOOK_SECRET;

if (!SECRET) {
    console.error("❌ ERROR: WEBHOOK_SECRET no está definido. Verifica el archivo .env.");
    process.exit(1);
}

app.use(express.json());

app.post("/webhook", (req, res) => {
    console.log("🔹 Solicitud de Webhook recibida.");

    const sig = `sha256=${crypto.createHmac("sha256", SECRET).update(JSON.stringify(req.body)).digest("hex")}`;
    if (req.headers["x-hub-signature-256"] !== sig) {
        return res.status(401).send("Invalid signature");
    }

    const repo = req.body.repository.name;
    console.log(`Webhook activado para ${repo}`);

    if (!repo) {
        console.log("Repositorio no encontrado en la solicitud.");
        return res.status(400).send("Repositorio no encontrado.");
    }

    // Ejecutar el script de despliegue
    const deployCommand = `/var/www/tecappsys/api/node/api.node.ci-cd/deploy.sh ${repo}`;

    try {
        exec(deployCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error ejecutando el script para ${repo}:`, stderr);
                
                // Intentar detener PM2 en caso de error
                console.log("🛑 Deteniendo servicio ci-cd en PM2...");
                exec("pm2 stop ci-cd", (pm2Error, pm2Stdout, pm2Stderr) => {
                    if (pm2Error) {
                        console.error("❌ Error al detener PM2:", pm2Stderr);
                    } else {
                        console.log("✅ Servicio ci-cd detenido en PM2:", pm2Stdout);
                    }
                });
    
                return res.status(500).send(stderr);
            }
    
            console.log(`✅ Despliegue exitoso para ${repo}:`, stdout);
            res.send("Despliegue exitoso");
        });
    } catch (err) {
        console.error("❌ Error inesperado:", err);
    
        // Intentar detener PM2 en caso de error inesperado
        console.log("🛑 Deteniendo servicio ci-cd en PM2...");
        exec("pm2 stop ci-cd", (pm2Error, pm2Stdout, pm2Stderr) => {
            if (pm2Error) {
                console.error("❌ Error al detener PM2:", pm2Stderr);
            } else {
                console.log("✅ Servicio ci-cd detenido en PM2:", pm2Stdout);
            }
        });
    
        res.status(500).send("Error inesperado en el servidor.");
    }
});

app.listen(PORT, () => console.log(`🚀 Webhook listener corriendo en puerto ${PORT}`));

//  tail -f /var/www/tecappsys/api/node/api.node.ci-cd/deploy.log
//  chmod +x /var/www/tecappsys/api/node/api.node.ci-cd/deploy.sh
