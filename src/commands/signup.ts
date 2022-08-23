import { CommandInteraction, GuildMember } from "discord.js";
import Command from "../structures/Command";

const groups = [
	{ name: "Première année, groupe 1", value: "s1-1", role: "TD1 (S1&2)" },
	{ name: "Première année, groupe 2", value: "s1-2", role: "TD2 (S1&2)" },
	{ name: "Première année, groupe 3", value: "s1-3", role: "TD3 (S1&2)" },
	{ name: "Première année, groupe 4", value: "s1-4", role: "TD4 (S1&2)" },
	{ name: "Première année, groupe 5", value: "s1-5", role: "TD5 (S1&2)" },
	{ name: "Deuxième année, groupe 1", value: "s3-1", role: "TD1 (S3&4)" },
	{ name: "Deuxième année, groupe 2", value: "s3-2", role: "TD2 (S3&4)" },
	{ name: "Deuxième année, groupe 3", value: "s3-3", role: "TD3 (S3&4)" },
	{ name: "Deuxième année, groupe 4", value: "s3-4", role: "TD4 (S3&4)" },
];
const choices = groups.map(({ name, value }) => ({ name, value }));

const studentRoleName = "- ÉTUDIANT »";

function capitalize(name: string) {
	return name
		.toLowerCase()
		.replace(/[ -]([a-z]){1}|(^[a-z]){1}/g, m => m.toUpperCase());
}

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
		const groupRoleName = groups.find(g => g.value === group).role;
		const groupRole = interaction.guild.roles.cache
			.find(r => r.name === groupRoleName);
		const studentRole = interaction.guild.roles.cache
			.find(r => r.name === studentRoleName);

		Promise.all([
			member.setNickname(capitalize(`${firstname} ${lastname}`)),
			member.roles.add([groupRole, studentRole])
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
