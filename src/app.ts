import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import McwhitelistCommand from "./commands/mcwhitelist";
import SignupCommand from "./commands/signup";
import interactionCreate from "./events/interactionCreate";
import CommandHandler from "./handlers/CommandHandler";

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;

const commands = new CommandHandler();
commands.register(SignupCommand, McwhitelistCommand);

if (process.env.DEPLOY_SLASH) {
	const rest = new REST({ version: "10" }).setToken(token);
	const slash = Array.from(commands.commands.values());
	const body = slash.map(c => c.toSlashCommand().toJSON());
	rest.put(Routes.applicationCommands(clientId), { body })
		.then(() => console.log("Slash commands registered"))
		.catch(console.error);
}

const client = new Client({
	intents: [ "GuildMembers" ]
});

client.login(process.env.token).then(() => {
	console.log(`Connecté aux serveurs Discord !`);
	
	Promise.all([
		client.application.commands.fetch(),
		client.guilds.cache.get(process.env.MAIN_SERVER_ID).roles.fetch()
	]).then(() => {
		client.on("interactionCreate", interaction => {
			interactionCreate(commands, interaction);
		});
	});
});
