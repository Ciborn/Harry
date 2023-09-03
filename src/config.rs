use config::Config as ConfigConfig;
use config::ConfigError;
use once_cell::sync::Lazy;
use poise::serenity_prelude::RoleId;
use serde::Deserialize;

// Global Config
pub static CONFIG: Lazy<Config> = Lazy::new(|| Config::new().unwrap());

#[derive(Debug, Deserialize, Clone)]
pub struct Group {
    pub id: String,
    pub name: String,
    pub roles: Vec<u64>,
}

impl Group {
    pub fn to_roleids(&self) -> Vec<RoleId> {
        self.roles
            .iter()
            .map(|role| RoleId(role.to_owned()))
            .collect::<Vec<RoleId>>()
    }
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub token: String,
    pub current_year: String,
    pub groups: Vec<Group>,
}

impl Config {
    pub fn new() -> Result<Self, ConfigError> {
        ConfigConfig::builder()
            .add_source(config::File::with_name("config"))
            .build()?
            .try_deserialize()
    }

    pub fn roles_contains(&self, roles: &[RoleId]) -> bool {
        for role in roles {
            for group in &self.groups {
                if group.roles.contains(role.as_u64()) {
                    return true;
                }
            }
        }

        false
    }
}
