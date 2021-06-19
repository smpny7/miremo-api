import axios from "axios";

const mcPing = require("mc-ping-updated");
const sharp = require("sharp");

/**
 * Get minecraft server icon.
 * @param {string} host The minecraft server host.
 * @param {number} port The minecraft server port.
 * @return {Promise} Promise of connection with minecraft server.
 */
export function serverIconAsync(host: string, port: number): Promise<any> {
  return new Promise((resolve, reject) => {
    mcPing(host, port, (err: any, res: any) => {
      if (err) reject(err);
      // eslint-disable-next-line max-len
      else resolve(Buffer.from(res.favicon.replace(/^data:image\/png;base64,/, ""), "base64"));
    });
  });
}

/**
 * Get minecraft player icon.
 * @param {string} minecraftId The minecraft player name.
 * @return {Promise} Promise of connection with mojang server.
 */
export function playerIconAsync(minecraftId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const getUUID = "https://api.mojang.com/users/profiles/minecraft/" + minecraftId;

    axios.get(getUUID).then((res) => {
      if (typeof res.data.id !== "undefined") {
        const getUserData = "https://sessionserver.mojang.com/session/minecraft/profile/" + res.data.id;
        axios.get(getUserData)
            .then(async (res) => {
              // eslint-disable-next-line max-len
              const decode: string = Buffer.from(res.data.properties[0].value, "base64").toString();
              const getIconData = JSON.parse(decode);
              const getIconUrl = getIconData.textures.SKIN.url;
              const image = await trimming(minecraftId, getIconUrl);
              resolve(image);
            })
            .catch((err) => reject(err));
      }
    });
  });
}

/**
 * Extract the face from minecraft skin.
 * @param {string} minecraftId The minecraft player name.
 * @param {string} getIconUrl The minecraft player icon url.
 */
async function trimming(minecraftId: string, getIconUrl: string) {
  const input = (await axios({
    url: getIconUrl,
    responseType: "arraybuffer",
  })).data as Buffer;

  return await sharp(input)
      .extract({width: 8, height: 8, left: 8, top: 8})
      .toBuffer();
}
