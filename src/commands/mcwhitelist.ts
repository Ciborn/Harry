import { BaseGuildTextChannel, CommandInteraction, GuildMember } from "discord.js";
import { Rcon } from "rcon-client";
import Command from "../structures/Command";

const host = process.env.MC_SERVER_RCON_HOST;
const port = Number(process.env.MC_SERVER_RCON_PORT);
const password = process.env.MC_SERVER_RCON_PASS;
const channel = process.env.MC_CHANNEL_WHITELISTED;

export default class McwhitelistCommand extends Command {
	constructor() {
		super("mcwhitelist", {
			description: "Whitelistez-vous sur le serveur Minecraft du BDE",
			args: {
				nickname: { as: "string", desc: "Votre pseudo Minecraft" }
			}
		});
	}

	async run(interaction: CommandInteraction) {
		const nickname = interaction.options.get("nickname").value as string;

		const member = interaction.member as GuildMember;
		const minecraftRole = interaction.guild.roles.cache
			.find(r => r.name === "Minecraft");
		const whitelisted = await interaction.guild.channels
			.fetch(channel) as BaseGuildTextChannel;

		const rcon = await Rcon.connect({ host, port, password });

		Promise.all([
			rcon.send(`whitelist add ${nickname}`),
			member.roles.add(minecraftRole)
		]).then(() => {
			interaction.reply({
				content: "Vous avez été whitelisté sur le serveur Minecraft avec succès !",
				ephemeral: true
			});
			whitelisted.send(`${interaction.user} s'est whitelisté en tant que **${nickname}**.`);
		}).catch(err => {
			console.error(err);
			interaction.reply({
				content: "Quelque chose s'est mal passé ! Veuillez contacter un administrateur du serveur.",
				ephemeral: true
			});
		});
	}
}
