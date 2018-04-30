
Object.defineProperty(exports, "__esModule", { value: true });

var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: '3783f0c9-c99c-47da-b9e1-0c52aee20f29',//process.env.MicrosoftAppId,
    appPassword: '38f]_UiQr-f+}Mlg',//process.env.MicrosoftAppPassword,
    // openIdMetadata: process.env.BotOpenIdMetadata
});

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
// bot.set('storage', tableStorage);

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name and surname?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }
]);

module.exports = connector;