use config::CONFIG;
use poise::serenity_prelude as serenity;

mod commands;
mod config;
mod slash_arguments;

// Types used by all command functions
type Error = Box<dyn std::error::Error + Send + Sync>;
type Context<'a> = poise::Context<'a, (), Error>;

async fn on_error(error: poise::FrameworkError<'_, (), Error>) {
    // This is our custom error handler
    // They are many errors that can occur, so we only handle the ones we want to customize
    // and forward the rest to the default handler
    match error {
        poise::FrameworkError::Setup { error, .. } => panic!("Failed to start bot: {:?}", error),
        poise::FrameworkError::Command { error, ctx } => {
            println!("Error in command `{}`: {:?}", ctx.command().name, error,);

            ctx.send(|reply| 
                reply.content("Quelque chose s'est mal passé ! Veuillez contacter un administrateur du serveur.")
                .ephemeral(true)
            ).await.unwrap();
        }
        error => {
            if let Err(e) = poise::builtins::on_error(error).await {
                println!("Error while handling error: {}", e)
            }
        }
    }
}

#[tokio::main]
async fn main() {
    poise::Framework::builder()
        .token(&CONFIG.token)
        .options(poise::FrameworkOptions {
            on_error: |error| Box::pin(on_error(error)),
            commands: vec![
                commands::signup::inscription(),
                commands::switch_class::changer_classe(),
            ],
            ..Default::default()
        })
        .setup(move |ctx, _ready, framework| {
            Box::pin(async move {
                println!(
                    "Connecté aux serveurs Discord en tant que {}!",
                    _ready.user.name
                );
                poise::builtins::register_globally(ctx, &framework.options().commands).await?;
                Ok(())
            })
        })
        .intents(serenity::GatewayIntents::privileged() | serenity::GatewayIntents::GUILDS)
        .run()
        .await
        .unwrap();
}
