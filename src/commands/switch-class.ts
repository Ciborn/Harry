import { CommandInteraction, GuildMember } from "discord.js";
import Command from "../structures/Command.js";
import { groups } from "../utils/Constants.js";

const choices = Object.entries(groups)
	.map(([value, { name }]) => ({ name, value }));

const globalRoles = [
	process.env.ROLE_ID_STUDENT,
	process.env.ROLE_ID_TEACHER,
	process.env.ROLE_ID_ALUMNI,
	process.env.ROLE_ID_GUEST,
];

export default class SwitchclassCommand extends Command {
	constructor() {
		super("changer-classe", {
			description: "Nouvelle année, nouveau groupe !",
			args: {
				groupe: { as: "choice", desc: "Votre classe (ou catégorie)", choices },
			}
		})
	}

	async run(interaction: CommandInteraction) {
		const group = interaction.options.get("groupe").value as string;

		const member = interaction.member as GuildMember;
		
		if (member.roles.cache.find(r => r.name.includes('[2023] '))) {
			interaction.reply({
				content: "Il semblerait que vous ayez déjà sélectionné votre groupe pour l'année universitaire 2023-2024.\nSi vous avez fait une erreur dans la sélection de votre classe, veuillez le signaler aux administrateurs du serveur.",
				ephemeral: true,
			});
		} else {
			const roles = groups[group].roles;

			// warning: bad workaround for stupid issue
			// https://github.com/discordjs/discord.js/issues/8165
			
			// Add roles matching the selected group and remove previously given roles no longer matching the active group
			member.roles.add(roles).then(() => {
				member.roles.remove(globalRoles.filter(r => !roles.includes(r))).then(() => {
					interaction.reply({
						content: "Votre nouveau groupe pour la nouvelle année universitaire a bien été sélectionné !\nDans le doute, vérifiez que vos rôles sont bien en adéquation avec votre groupe.",
						ephemeral: true
					});
				}).catch(err => {
					console.error(err);
					interaction.reply({
						content: "Quelque chose s'est mal passé ! Veuillez contacter les administrateurs du serveur.",
						ephemeral: true
					});
				});
			}).catch(err => {
				console.error(err);
				interaction.reply({
					content: "Quelque chose s'est mal passé ! Veuillez contacter les administrateurs du serveur.",
					ephemeral: true
				});
			});
		}
	}
}
