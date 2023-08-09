import { CommandInteraction, GuildMember } from "discord.js";
import Command from "../structures/Command.js";
import { groups } from "../utils/Constants.js";

const choices = Object.entries(groups)
	.map(([value, { name }]) => ({ name, value }));

function capitalize(name: string) {
	return name
		.toLowerCase()
		.replace(/[ -]([a-z]){1}|(^[a-z]){1}/g, m => m.toUpperCase());
}

export default class SignupCommand extends Command {
	constructor() {
		super("inscription", {
			description: "Renseignez votre identité pour accéder au serveur",
			args: {
				prenom: { as: "string", desc: "Votre prénom" },
				nom: { as: "string", desc: "Votre nom de famille" },
				groupe: { as: "choice", desc: "Votre classe (ou catégorie)", choices }
			}
		});
	}

	run(interaction: CommandInteraction) {
		const firstname = interaction.options.get("prenom").value as string;
		const lastname = interaction.options.get("nom").value as string;
		const group = interaction.options.get("groupe").value as string;

		const member = interaction.member as GuildMember;

		Promise.all([
			member.setNickname(capitalize(`${firstname} ${lastname}`)),
			member.roles.add(groups[group].roles)
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
