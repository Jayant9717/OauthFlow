// import { Request, Response } from "express";
// import axios from "axios";
// import https from "https";

// import Token from "../models/token.model";

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// });

// const CLIENT_ID =
//   process.env.CLIENT_ID || "90fb9f82-525f-4ba2-992a-d3bd4063bb6d";
// const CLIENT_SECRET =
//   process.env.CLIENT_SECRET || "272304b4-ca19-47ff-9f41-cdfc9d24e635";

// let SCOPES: string = "crm.schemas.contacts.read";
// if (process.env.SCOPE) {
//   SCOPES = process.env.SCOPE.split(/ |, ?|%20/).join(" ");
// }

// const REDIRECT_URI = `http://localhost:5000/api/oauthcallback`;
// const authUrl =
//   "https://app.hubspot.com/oauth/authorize" +
//   `?client_id=${encodeURIComponent(CLIENT_ID)}` +
//   `&scope=${encodeURIComponent(SCOPES)}` +
//   `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

// export const authRoute = (req: Request, res: Response) => {
//   console.log("Redirecting to:", authUrl);
//   res.redirect(authUrl);
// };

// export const oauthCallback = async (req: Request, res: Response) => {
//   console.log("===========================", req.query.code);
//   if (req.query.code) {
//     const authCodeProof = {
//       grant_type: "authorization_code",
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: REDIRECT_URI,
//       code: req.query.code,
//     };
//     console.log(authCodeProof);
//     try {
//       const tokenResponse = await axios.post(
//         "https://api.hubapi.com/oauth/v1/token",
//         authCodeProof,
//         {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           httpsAgent: agent,
//         }
//       );
//       console.log(tokenResponse.data);

//       const { access_token, refresh_token, expires_in } = tokenResponse.data;

//       const tokenData = new Token({
//         accessToken: access_token,
//         refreshToken: refresh_token,
//         expiresIn: expires_in,
//       });

//       await tokenData.save();

//       res.redirect(`http://localhost:5173/contacts`);
//     } catch (error) {
//       console.error("Error exchanging code for tokens:", error);
//       res.status(500).send("Error exchanging code for tokens");
//     }
//   } else {
//     res.status(400).send("No code provided");
//   }
// };
import { Request, Response } from "express";
import axios from "axios";
import https from "https";
import Token from "../models/token.model";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

class OAuthController {
  private static instance: OAuthController | null = null;

  private clientId: string;
  private clientSecret: string;
  private scopes: string;
  private redirectUri: string;
  private authUrl: string;

  private constructor() {
    this.clientId =
      process.env.CLIENT_ID || "90fb9f82-525f-4ba2-992a-d3bd4063bb6d";
    this.clientSecret =
      process.env.CLIENT_SECRET || "272304b4-ca19-47ff-9f41-cdfc9d24e635";
    this.scopes = process.env.SCOPE
      ? process.env.SCOPE.split(/ |, ?|%20/).join(" ")
      : "crm.schemas.contacts.read";
    this.redirectUri = `http://localhost:5000/api/oauthcallback`;
    this.authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${encodeURIComponent(
      this.clientId
    )}&scope=${encodeURIComponent(
      this.scopes
    )}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
  }

  public static getInstance(): OAuthController {
    if (!this.instance) {
      this.instance = new OAuthController();
    }
    return this.instance;
  }

  public authRoute(req: Request, res: Response): void {
    console.log("Redirecting to:", this.authUrl);
    res.redirect(this.authUrl);
  }

  public async oauthCallback(req: Request, res: Response): Promise<void> {
    console.log("code for requesting tokens from hubspot", req.query.code);
    if (req.query.code) {
      const authCodeProof = this.createAuthCodeProof(req.query.code as string);
      console.log(authCodeProof);

      try {
        const tokenResponse = await this.exchangeCodeForTokens(authCodeProof);
        console.log(tokenResponse.data);

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        await this.saveToken(access_token, refresh_token, expires_in);

        res.redirect(`http://localhost:5173/contacts`);
      } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        res.status(500).send("Error exchanging code for tokens");
      }
    } else {
      res.status(400).send("No code provided");
    }
  }

  private createAuthCodeProof(code: string): Record<string, string> {
    return {
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
    };
  }

  private async exchangeCodeForTokens(
    authCodeProof: Record<string, string>
  ): Promise<any> {
    return axios.post("https://api.hubapi.com/oauth/v1/token", authCodeProof, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      httpsAgent: agent,
    });
  }

  private async saveToken(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): Promise<void> {
    const tokenData = new Token({
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
    });
    await tokenData.save();
  }
}

export default OAuthController.getInstance();
