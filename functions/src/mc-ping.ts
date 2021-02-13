const mc_ping = require("mc-ping-updated");

export function pingAsync(host: string, port: number): Promise<any> {
    return new Promise((resolve, reject) => {
        mc_ping(host, port, function(err: any, res: any) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export function pingOnlineAsync(host: string, port: number): Promise<any> {
    return new Promise((resolve, reject) => {
        mc_ping(host, port, function(err: any, res: any) {
            if (err) {
                reject(err);
            } else if (res.players.sample) {
                resolve(res.players.sample)
            } else {
                resolve([])
            }
        })
    })
}
