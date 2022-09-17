import { BaseInteraction } from "discord.js";
import CommandHandler from "../handlers/CommandHandler.js";

export default function interactionCreate(
	handler: CommandHandler,
	interaction: BaseInteraction
) {
	if (!interaction.isCommand() || !interaction.command) return;
	handler.execute(interaction);
}
