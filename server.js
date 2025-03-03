require('dotenv').config();
const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const PORT = 9000;
const GIT_HOOK_SECRET = process.env.GIT_HOOK_SECRET;
const reposPath = process.env.REPOS

const validateRepository = (req) =>{
    const repo = req.body.repository.name ? req.body.repository.name : null; 
    if (!repo) {
        console.log("⚠️ Repositorio no encontrado en la solicitud.");        
    }
    return repo;
}

const validateSignature = (req,repo) => {
    console.log("⏳ Validando Git Hook signature ");   
    const sig = `sha256=${crypto.createHmac("sha256", GIT_HOOK_SECRET).update(JSON.stringify(req.body)).digest("hex")}`;
    let validateSignature = (req.headers["x-hub-signature-256"] !== sig)
    (!validateSignature) ? console.log(`❌ Invalid signature github hook ${repo}`) :console.log(`✅ Valid signature github hook ${repo}`);
    return validateSignature
}

app.use(express.json());

app.post("/webhook", (req, res) => {
    const repo = validateRepository(req);
    !repo && res.status(400).send("Repositorio no encontrado.");
    !validateSignature(req,repo) && res.status(401).send("Invalid signature");

    // Ejecutar el script de despliegue
    const deployCommand = `./scripts/repoToWebSite.sh ${repo} ${process.env[repo.toUpperCase()]} ${reposPath+repo} ${process.env.LOG_FILE}`;

    try {
        exec(deployCommand, (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Error ejecutando el script para ${repo}:`, stderr);
                return res.status(500).send(stderr);
            }    
            console.log(`✅ Despliegue exitoso para ${repo}:`, stdout);
            res.send(`${repo} Despliegue exitoso`);
        });
    } catch (err) {
        console.log("❌ Error inesperado:", err); 
        res.status(500).send("Error inesperado en el servidor.");
    }
});

app.listen(PORT, () => console.log(`🚀 Webhook listener corriendo en puerto ${PORT}`));

//  tail -f /var/www/tecappsys/api/node/api.node.ci-cd/deploy.log
//  chmod +x /var/www/tecappsys/api/node/api.node.ci-cd/deploy.sh
