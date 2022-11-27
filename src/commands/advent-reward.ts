import { ActionRowBuilder, Attachment, ButtonBuilder, ButtonStyle, Client, CommandInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import Command from "../structures/Command.js";

const ADVENT_FILE = "cache/advent.json";

const looksGoodButton = new ButtonBuilder()
	.setCustomId("good")
	.setEmoji("✅")
	.setLabel("ça rend bien")
	.setStyle(ButtonStyle.Success);

const looksBadButton = new ButtonBuilder()
	.setCustomId("bad")
	.setEmoji("❌")
	.setLabel("on annule tout")
	.setStyle(ButtonStyle.Danger);

const claimGiftButton = new ButtonBuilder()
	.setCustomId("claim")
	.setEmoji("✅")
	.setLabel("Récupérer le cadeau")
	.setStyle(ButtonStyle.Success);

const giveGiftButton = new ButtonBuilder()
	.setCustomId("give")
	.setEmoji("🎁")
	.setLabel("Donner le cadeau")
	.setStyle(ButtonStyle.Secondary);

const looksButtons = new ActionRowBuilder<ButtonBuilder>()
	.addComponents(looksGoodButton, looksBadButton);

const claimButtons = new ActionRowBuilder<ButtonBuilder>()
	.addComponents(claimGiftButton, giveGiftButton);

async function readWinners() {
	try {
		const file = await readFile(ADVENT_FILE, { encoding: "utf-8" });

		return JSON.parse(file).winners as string[];
	} catch(err) {
		writeIntoFile([]);
	}

	return []
}

async function writeIntoFile(winners: string[]) {
	await writeFile(ADVENT_FILE, JSON.stringify({ winners }));
}

async function writeWinner(id: string) {
	return writeIntoFile([...await readWinners(), id]);
}

async function reward(
	client: Client,
	text: string,
	embed: EmbedBuilder,
	skip: string[] = []
) {
	const channel = client.channels.cache.get(process.env.ADVENT_CHANNEL_ID) as TextChannel;

	const winners = await readWinners();
	const user = client.guilds.cache
		.get(process.env.MAIN_SERVER_ID).members.cache
		.filter(m =>
			m.roles.cache.has(process.env.ADHERENT_ROLE_ID)
			&& !m.roles.cache.has(process.env.FAKE_BINHARRY_ROLE_ID)
			&& !skip.includes(m.id)
			&& !winners.includes(m.id))
		.random();

	const content = text.replace("{user}", `${user}`);
	channel.send({
		content: `${user}`,
		embeds: [embed.setDescription(content)],
		components: [claimButtons],
	}).then(message => {
		message.awaitMessageComponent({
			filter: i => i.user.equals(user.user),
			time: 18000000, 
		}).then(claim => {
			if (claim.customId === "claim") {
				claim.update({
					content: `*${user} a récupéré son cadeau !*`,
					components: [],
				});
				writeWinner(user.id);
			} else if (claim.customId === "give") {
				claim.update({
					content: `${user} a décidé de donner son cadeau à quelqu'un d'autre...`,
					components: [],
					embeds: [],
				});
				reward(client, text, embed, [...skip, user.id]);
			}
		}).catch(() => {
			message.edit({
				content: `${user} n'a pas récupéré son cadeau...`,
				components: [],
				embeds: []
			});
			writeWinner(user.id);
			reward(client, text, embed, [...skip, user.id]);
		});
	});
}

export default class AdventReward extends Command {
	constructor() {
		super("advent-reward", {
			description: "Donnez un cadeau de l'Avent à votre adhérent préféré",
			args: {
				text: { as: "string", desc: "Ce que vous voulez dire au grand gagnant" },
				image: { as: "attachment", desc: "Une image correspondant au lot à faire gagner", optional: true },
			},
		});
	}

	async run(interaction: CommandInteraction) {
		const image = interaction.options.get("image")?.attachment as Attachment | null;
		const text = interaction.options.get("text").value as string;

		const embed = new EmbedBuilder()
			.setAuthor({
				iconURL: interaction.client.user.avatarURL(),
				name: "BDE Bin'Harry",
			})
			.setDescription(text.replace("{user}", `${interaction.user}`))
			.setColor("#00a6ed");

		if (image) {
			embed.setImage(image.url);
		}

		interaction.reply({
			content: `Le message suivant sera envoyé à 8h :\n\n${interaction.user}`,
			components: [looksButtons],
			embeds: [embed],
			ephemeral: true,
		}).then(message => {
			message
				.awaitMessageComponent({ filter: i => i.user.equals(interaction.user) })
				.then(confirm => {
					if (confirm.customId === "good") {
						const now = new Date();
						const next = now.getHours() >= 8
							? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8)
							: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8);
						const delay = next.getTime() - now.getTime();
				
						confirm.update({
							content: "il y a plus qu'à attendre",
							components: [],
							embeds: []
						});

						setTimeout(reward, delay, interaction.client, text, embed);
					} else if (confirm.customId === "bad") {
						confirm.update({
							content: "on annule tout",
							components: [],
							embeds: [],
						});
					}
				});
		});
	}
}
