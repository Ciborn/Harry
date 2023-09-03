use poise::serenity_prelude::CacheHttp;

use crate::{
    config::{Group, CONFIG},
    Context, Error,
};

/// Nouvelle année, nouveau groupe !
#[poise::command(slash_command, rename = "changer-classe")]
pub async fn changer_classe(
    ctx: Context<'_>,
    #[description = "Votre classe (ou catégorie)"] groupe: Group,
) -> Result<(), Error> {
    let mut member = ctx.author_member().await.unwrap();

    if member.roles(ctx).unwrap().into_iter().any(|role| {
        role.name
            .contains(format!("[{}] ", CONFIG.current_year).as_str())
    }) {
        ctx.send(|reply| {
            reply
                .content(format!(
                    "Il semblerait que vous ayez déjà sélectionné votre groupe pour l'année universitaire {}-{}.\nSi vous avez fait une erreur dans la sélection de votre classe, veuillez le signaler aux administrateurs du serveur.",
                    CONFIG.current_year,
                    CONFIG.current_year.parse::<usize>().unwrap() + 1)
                )
                .ephemeral(true)
        }).await?;

        return Ok(());
    }

    // Add roles matching the selected group and remove previously given roles no longer matching the active group

    member
        .to_mut()
        .remove_roles(ctx.http(), groupe.to_roleids().as_slice())
        .await?;

    member
        .to_mut()
        .add_roles(ctx.http(), groupe.to_roleids().as_slice())
        .await?;

    ctx.send(|reply| {
        reply
            .content("Votre nouveau groupe pour la nouvelle année universitaire a bien été sélectionné !\nDans le doute, vérifiez que vos rôles sont bien en adéquation avec votre groupe.")
            .ephemeral(true)
    }).await?;

    Ok(())
}
