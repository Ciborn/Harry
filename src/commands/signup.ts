import { CommandInteraction, GuildMember } from "discord.js";
import Command from "../structures/Command";

const choices = [
	{ name: "Première année, groupe 1", value: "s1-1" },
	{ name: "Première année, groupe 2", value: "s1-2" },
	{ name: "Première année, groupe 3", value: "s1-3" },
	{ name: "Première année, groupe 4", value: "s1-4" },
	{ name: "Première année, groupe 5", value: "s1-5" },
	{ name: "Deuxième année, groupe 1", value: "s3-1" },
	{ name: "Deuxième année, groupe 2", value: "s3-2" },
	{ name: "Deuxième année, groupe 3", value: "s3-3" },
	{ name: "Deuxième année, groupe 4", value: "s3-4" },
];

export default class SignupCommand extends Command {
	constructor() {
		super("signup", {
			description: "Renseignez votre identité pour accéder au serveur",
			args: {
				firstname: { as: "string", desc: "Votre prénom" },
				lastname: { as: "string", desc: "Votre nom de famille" },
				group: { as: "choice", desc: "Votre classe (ou \"Guest\")", choices }
			}
		});
	}

	run(interaction: CommandInteraction) {
		const firstname = interaction.options.get("firstname").value as string;
		const lastname = interaction.options.get("lastname").value as string;
		const group = interaction.options.get("group").value as string;

		const member = interaction.member as GuildMember;
		const role = interaction.guild.roles.cache
			.find(r => r.name.toLowerCase() === group);
		console.log([group, role]);

		Promise.all([
			member.setNickname(`${firstname} ${lastname}`),
			member.roles.add(role)
		]).then(() => {
			interaction.reply({
				content: "Vous avez été identifié avec succès !",
				ephemeral: true
			});
		}).catch(err => {
			console.error(err);
			interaction.reply({
				content: "Quelque chose s'est mal passé ! Veuillez contacter un administrateur du serveur.",
				ephemeral: true
			});
		});
	}
}
