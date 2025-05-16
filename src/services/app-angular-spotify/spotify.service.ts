import axios from "axios";
import { log } from "../../shared/core/utils/logger";

class AppAngularSpotifyService {
    private static instance: AppAngularSpotifyService;
    private token: string | null = null;
    private tokenExpiration: number | null = null;

    private API_SPOTIFY = process.env.APP_ANGULAR_SPOTIFY_API_URL;
    private API_SPOTIFY_CLIENT_ID = process.env.APP_ANGULAR_SPOTIFY_CLIENT_ID!;
    private API_SPOTIFY_CLIENT_SECRET = process.env.APP_ANGULAR_SPOTIFY_CLIENT_SECRET!;
    private header = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

    private constructor() {}

    public static getInstance(): AppAngularSpotifyService {
        if (!AppAngularSpotifyService.instance) {
            AppAngularSpotifyService.instance = new AppAngularSpotifyService();
        }
        return AppAngularSpotifyService.instance;
    }

    /**
     * Obtiene el token de autenticación de Spotify y lo almacena en caché.
     */
    public async getToken(): Promise<string> {
        try {
            if (this.token && this.tokenExpiration && Date.now() < this.tokenExpiration) {
                log.info({title: 'APP_ANGULAR_SPOTIFY_SERVICE_GET_TOKEN',description:"Reutilizando token de Spotify."});
                return this.token;
            }

            const url = `${this.API_SPOTIFY}/token`;
            const payload = new URLSearchParams();
            payload.append("grant_type", "client_credentials");
            payload.append("client_id", this.API_SPOTIFY_CLIENT_ID);
            payload.append("client_secret", this.API_SPOTIFY_CLIENT_SECRET);
            
            const response = await axios.post(url, payload, this.header);

            this.token = response.data;
            this.tokenExpiration = Date.now() + response.data.expires_in * 1000;
            log.info({title: 'APP_ANGULAR_SPOTIFY_SERVICE_GET_TOKEN',description:"Nuevo token de Spotify obtenido."});

            return this.token;
        } catch (error: any) {
            log.error({title: 'APP_ANGULAR_SPOTIFY_SERVICE_GET_TOKEN',description:`Error al obtener token: ${error.response?.data || error.message}`});
            throw new Error("Error al obtener token de Spotify");
        }
    }

    /**
     * Busca canciones en Spotify.
     */
    public async searchTracks(query: string): Promise<any> {
        try {
            const token = await this.getToken();
            const url = `${this.API_SPOTIFY}/v1/search?q=${encodeURIComponent(query)}&type=track`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error: any) {
            log.error({title: 'APP_ANGULAR_SPOTIFY_SERVICE_SEARCH_TRACK',description:`Error en búsqueda de canciones: ${error.response?.data || error.message}`});
            throw new Error("Error en búsqueda de canciones");
        }
    }

}

export default AppAngularSpotifyService.getInstance();