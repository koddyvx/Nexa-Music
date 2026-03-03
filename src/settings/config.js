module.exports = { 
    token: "-",  //token of your bot, get it from https://discord.com/developers/applications
    clientid: "-", //client id of your bot, get it from https://discord.com/developers/applications
    prefix: "-", //prefix of your bot, for example "!" or "n!"
    engine: "ytsearch", //search engine for the play command, options: "ytsearch", "spotify", "soundcloud", "deezer", "applemusic"
    color: "#FF0000", //color of the ui, in hex format
    mongodburl: "", //mongodb url for the dashboard, if you don't want to use the dashboard, you can leave it as an empty string
    geniusToken: "", //genius token for lyrics command, get it from https://genius.com/developers
    developers: [""], //array of developer ids, these users will have access to the developer commands and the dashboard
    nodes: [
        {
            name: "nexa-1", //name of the node, can be anything
            host: "localhost", //host of the lavalink server, if it's on the same machine as the bot, you can use "localhost"
            password: "youshallnotpass", //password of the lavalink server, get it from your lavalink config
            port: 2000, //port of the lavalink server, get it from your lavalink config
            secure: false, //whether the lavalink server is secure (https) or not (http), get it from your lavalink config
        },
    ]
}

/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Organization: Infinity
 *
 * This project is open-source and free to use, modify, and distribute.
 * If you encounter any issues, errors, or have questions,
 * please contact us through the official support server:
 * https://discord.gg/fbu64BmPFD
 */

