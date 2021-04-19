const mcPing = require("mc-ping-updated");

/**
 * Connect to minecraft server.
 * @param {string} host The minecraft server host.
 * @param {number} port The minecraft server port.
 * @return {Promise} Promise of connection with minecraft server.
 */
export function pingAsync(host: string, port: number): Promise<any> {
  return new Promise((resolve, reject) => {
    mcPing(host, port, (err: any, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

/**
 * Get online players in minecraft server.
 * @param {string} host The minecraft server host.
 * @param {number} port The minecraft server port.
 * @return {Promise} Promise of connection with minecraft server.
 */
export function pingOnlineAsync(host: string, port: number): Promise<any> {
  return new Promise((resolve, reject) => {
    mcPing(host, port, function(err: any, res: any) {
      if (err) {
        reject(err);
      } else if (res.players.sample) {
        resolve(res.players.sample);
      } else {
        resolve([]);
      }
    });
  });
}
