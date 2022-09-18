import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { CommandInteraction, GuildMember } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import Command from "../structures/Command.js";

const promoRegex = /TD[1-5] \((?<promo>S[13])&[24]\)/;

export default class BuddySignupCommand extends Command {
	constructor() {
		super("buddy-signup", {
			description: "Inscrivez-vous au système de parrainage"
		});
	}

	async run(interaction: CommandInteraction) {
		const member = interaction.member as GuildMember;
		const { promo } = member.roles.cache
			.find(r => r.name.includes("TD"))?.name
			.match(promoRegex).groups;
		
		const file = await readFile("./cache/buddy.csv", { encoding: "utf-8" });
		const couples: string[][] = parse(file, { delimiter: ";" });
		const s1 = couples.map(c => c[0]);
		const s3 = couples.map(c => c[1]);
		
		if (promo === "S1" && !s1.includes(member.id)) {
			const i = s1.findIndex(s => s === "");
			i !== -1 ? s1[i] = member.id : s1.push(member.id);
		} else if (promo === "S3" && !s3.includes(member.id)) {
			const i = s3.findIndex(s => s === "");
			i !== -1 ? s3[i] = member.id : s3.push(member.id);
		} else {
			return interaction.reply({
				content: "Vous vous êtes déjà inscrits au système de parrainage !",
				ephemeral: true
			});
		}

		const csvCouples = s1.length > s3.length
			? s1.map((s, i) => [s, s3[i]])
			: s3.map((s, i) => [s1[i], s]);
		const csv = stringify(csvCouples, { delimiter: ";" });
		await writeFile("./cache/buddy.csv", csv);

		interaction.reply({
			content: "Vous vous êtes inscrits au système de parrainage !",
			ephemeral: true
		});
	}
}
