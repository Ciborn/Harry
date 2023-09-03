use std::collections::HashMap;

use poise::serenity_prelude::{Colour, Member, UserId};

use crate::{config::Group, Context, Error};

/// Lister les membres d'une classe ou catégorie
#[poise::command(slash_command)]
pub async fn etudients(
    ctx: Context<'_>,
    #[description = "Classe (ou catégorie)"] groupe: Group,
) -> Result<(), Error> {
    // Tous les membres qui ont tous les roles du groupe sélectionné
    let members: HashMap<UserId, Member> = ctx
        .guild()
        .unwrap()
        .members
        .into_iter()
        .filter(|member| {
            groupe
                .to_roleids()
                .iter()
                .all(|role_id| member.1.roles.contains(role_id))
        })
        .collect();

    if members.is_empty() {
        ctx.send(|reply| {
            reply
                .ephemeral(true)
                .content(format!("Il n'y a aucun membre dans {}.", groupe.name))
        })
        .await?;

        Ok(())
    } else {
        ctx.send(|reply| {
            reply.ephemeral(true).embed(|embed| {
                embed
                    .color(Colour::BLUE)
                    .title(format!("Liste des {} :", groupe.name))
                    .description(
                        members
                            .values()
                            .map(|member| format!("- <@{}>", member.user.id))
                            .collect::<Vec<String>>()
                            .join("\n"),
                    )
            })
        })
        .await?;

        Ok(())
    }
}
