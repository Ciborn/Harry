import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import BuddyManageCommand from "./commands/buddy-manage.js";
import BuddyOptoutCommand from "./commands/buddy-optout.js";
import McwhitelistCommand from "./commands/mcwhitelist.js";
import SignupCommand from "./commands/signup.js";
import interactionCreate from "./events/interactionCreate.js";
import CommandHandler from "./handlers/CommandHandler.js";

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;

const commands = new CommandHandler();
commands.register(
	SignupCommand,
	McwhitelistCommand,
	BuddyManageCommand,
	BuddyOptoutCommand
);

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
		client.guilds.cache.get(process.env.MAIN_SERVER_ID).roles.fetch(),
		client.guilds.cache.get(process.env.MAIN_SERVER_ID).members.fetch()
	]).then(() => {
		client.on("interactionCreate", interaction => {
			interactionCreate(commands, interaction);
		});
	});
});
