// import axios from "axios";
// import { Request, Response } from "express";
// import Token from "../models/token.model";
// import https from "https";

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// });

// const refreshAccessToken = async (refreshToken: any) => {
//   try {
//     const params = {
//       grant_type: "refresh_token",
//       refresh_token: refreshToken,
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET,
//     };
//     const response = await axios.post(
//       "https://api.hubapi.com/oauth/v1/token",
//       params,
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         httpsAgent: agent,
//       }
//     );
//     return response.data.access_token;
//   } catch (error) {
//     console.error("Error refreshing access token:", error);
//     throw new Error("Failed to refresh access token");
//   }
// };

// export const displayData = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const tokenData = await Token.findOne();
//     if (!tokenData) {
//       return res.status(404).send("No access token found");
//     }

//     let { accessToken, refreshToken, updatedAt } = tokenData;
//     const url = "https://api.hubapi.com/properties/v1/contacts/properties";

//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         httpsAgent: agent,
//       });
//       console.log("api response success");
//       return res.json(response.data);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         if (error.response && error.response.status === 401) {
//           accessToken = await refreshAccessToken(refreshToken);
//           tokenData.accessToken = accessToken;
//           tokenData.updatedAt = new Date();
//           await tokenData.save();
//         } else {
//           console.error("An error occurred:", error.message);
//         }

//         const response = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//           httpsAgent: agent,
//         });
//         return res.json(response.data);
//       } else {
//         console.error("Error fetching data from HubSpot API:", error);
//         return res.status(500).send("Error fetching data from HubSpot API");
//       }
//     }
//   } catch (error) {
//     console.error("Error in displayData function:", error);
//     return res.status(500).send("Error processing request");
//   }
// };

// export const RefreshTokenApi = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const tokenData = await Token.findOne();
//     if (!tokenData) {
//       return res.status(404).send("No token data found");
//     }
//     const { refreshToken } = tokenData;
//     const accessToken = await refreshAccessToken(refreshToken);
//     tokenData.accessToken = accessToken;
//     tokenData.updatedAt = new Date();
//     await tokenData.save();

//     return res.json({ message: "Access token refreshed successfully" });
//   } catch (error) {
//     console.error("Error in manualRefreshToken function:", error);
//     return res.status(500).send("Error processing request");
//   }
// };
import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import Token from "../models/token.model";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

class TokenManager {
  private static instance: TokenManager | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!this.instance) {
      this.instance = new TokenManager();
    }
    return this.instance;
  }

  private async refreshAccessToken(refreshToken: string) {
    try {
      const params = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      };
      const response = await axios.post(
        "https://api.hubapi.com/oauth/v1/token",
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          httpsAgent: agent,
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  public async displayData(req: Request, res: Response): Promise<any> {
    try {
      const tokenData = await Token.findOne();
      if (!tokenData) {
        return res.status(404).send("No access token found");
      }

      let { accessToken, refreshToken } = tokenData;
      const url = "https://api.hubapi.com/properties/v1/contacts/properties";

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          httpsAgent: agent,
        });
        console.log("API response success");
        return res.json(response.data);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          accessToken = await this.refreshAccessToken(refreshToken as string);
          tokenData.accessToken = accessToken;
          tokenData.updatedAt = new Date();
          await tokenData.save();

          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            httpsAgent: agent,
          });
          return res.json(response.data);
        } else {
          console.error("An error occurred:", error);
          return res.status(500).send("Error fetching data from HubSpot API");
        }
      }
    } catch (error) {
      console.error("Error in displayData function:", error);
      return res.status(500).send("Error processing request");
    }
  }

  public async refreshTokenApi(req: Request, res: Response): Promise<any> {
    try {
      const tokenData = await Token.findOne();
      if (!tokenData) {
        return res.status(404).send("No token data found");
      }

      const { refreshToken } = tokenData;
      const accessToken = await this.refreshAccessToken(refreshToken as string);
      tokenData.accessToken = accessToken;
      tokenData.updatedAt = new Date();
      await tokenData.save();

      return res.json({
        message: "Access token refreshed successfully",
        accessToken,
      });
    } catch (error) {
      console.error("Error in manualRefreshToken function:", error);
      return res.status(500).send("Error processing request");
    }
  }
}

export default TokenManager.getInstance();
