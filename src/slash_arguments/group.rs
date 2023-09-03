use crate::config::{Group, CONFIG};

#[poise::async_trait]
impl poise::SlashArgument for Group {
    async fn extract(
        _: &poise::serenity_prelude::Context,
        _: poise::ApplicationCommandOrAutocompleteInteraction<'_>,
        value: &poise::serenity_prelude::json::Value,
    ) -> ::std::result::Result<Self, poise::SlashArgError> {
        let choice = value
            .as_u64()
            .ok_or(poise::SlashArgError::CommandStructureMismatch(
                "expected u64",
            ))?;

        let choice_usize = choice as usize;

        if choice_usize >= CONFIG.groups.len() {
            return Err(poise::SlashArgError::CommandStructureMismatch(
                "choice index out of bounds",
            ));
        }

        Ok(CONFIG.groups[choice_usize].clone())
    }

    fn create(builder: &mut poise::serenity_prelude::CreateApplicationCommandOption) {
        builder.kind(poise::serenity_prelude::CommandOptionType::Integer);
    }

    fn choices() -> Vec<poise::CommandParameterChoice> {
        CONFIG
            .groups
            .iter()
            .map(|group| poise::CommandParameterChoice {
                name: group.name.to_owned(),
                localizations: std::collections::HashMap::new(),
            })
            .collect()
    }
}
