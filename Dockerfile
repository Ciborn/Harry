# ========== Stage 1: Builder ========== #
FROM rust:1-alpine3.17 as builder

RUN apk add musl-dev

RUN cargo new /app/harry
COPY ./Cargo.toml ./Cargo.lock /app/harry/

WORKDIR /app/harry

RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

COPY . .

RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

# ========= Stage 2: Production ========= #
FROM alpine as production

WORKDIR /app

COPY --from=builder /app/harry/target/release/harry /app/harry

CMD ./harry