module.exports = {
    apps: [
      {
        name: "api-node-main",
        script: "dist/app.js",
        watch: true, // Reiniciar la aplicación si hay cambios en el código
        ignore_watch: ["node_modules", "logs"],
        exec_mode: "cluster", // Activa múltiples instancias en CPUs disponibles
        instances: 1, // Puedes cambiarlo a "max" para usar todos los núcleos
        env: {
          PORT:3000,

          //GITHUB CI-CD
          GIT_HOOK_SECRET:'5ZhiX{>x2T62',
          REPOS_PATH:'/var/www/tecappsys/repos/',
          LOG_FILE:'/var/www/tecappsys/api/node/api.node.main/deploy.log',
          'api.node.main':'/var/www/tecappsys/api/node/api.node.main/',
          'app.portal':'/var/www/tecappsys/portfolio/home/',
          'app.portal.angular':'/var/www/tecappsys/portfolio/angular/home/',
          'app.portal.react':'/var/www/tecappsys/portfolio/react/home',

          //app.angular.spotify
          APP_ANGULAR_SPOTIFY_SPOTIFY:'https://accounts.spotify.com/api',
          APP_ANGULAR_SPOTIFY_CLIENT_ID:'724ee5a40d204cdd81c6471e37dc3240',
          APP_ANGULAR_SPOTIFY_CLIENT_SECRET:'3000fbe4633842b0b368f1644206394b',
        }
      }
    ]
  };