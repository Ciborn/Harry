use poise::serenity_prelude::CacheHttp;

use crate::{
    config::{Group, CONFIG},
    Context, Error,
};

/// Renseignez votre identité pour accéder au serveur
#[poise::command(slash_command)]
pub async fn inscription(
    ctx: Context<'_>,
    #[description = "Votre prénom"] prenom: String,
    #[description = "Votre nom"] nom: String,
    #[description = "Votre classe (ou catégorie)"] groupe: Group,
) -> Result<(), Error> {
    let member = ctx.author_member().await.unwrap();

    // checks that the user is not already registered
    if CONFIG.roles_contains(member.roles.as_slice()) {
        ctx.send(|reply| {
            reply
                .content("Il semblerait que vous soyez déjà inscrit. Pour changer de classe, utilisez la commande /changer-classe.")
                .ephemeral(true)
        }).await?;

        return Ok(());
    }

    member
        .edit(ctx.http(), |edit| {
            edit.nickname(format!("{} {}", prenom, nom))
        })
        .await?
        .add_roles(ctx.http(), groupe.to_roleids().as_slice())
        .await?;

    ctx.send(|reply| {
        reply
            .content("Vous avez été identifié avec succès !")
            .ephemeral(true)
    })
    .await?;

    Ok(())
}
