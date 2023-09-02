# Harry
Harry est un bot Discord utilisé par le serveur Discord étudiant du BUT informatique à l'IUT de Reims. Pour l'instant, Harry n'est pas très utile, il ne permet que de configurer son identité sur le serveur. Harry sera sans doute plus utile dans un futur proche. Harry est actuellement développé par [Robin Bourachot](https://github.com/Ciborn), et certaines parties de son code ont été repris du bot [Aldebaran](https://github.com/Nightorn/Aldebaran). Harry est maintenu en vie par le [BDE de l'IUT](http://404cm.com/).
## Utilisation d'Harry

Harry peut être démarré avec docker en utilisant ce `compose.yml` :
```yml
services:
  harry:
    image: ghcr.io/ciborn/harry:latest
    volumes:
      - ./config.yml:/app/config.yml
```

Le fichier `config.yml` doit être préalablement créé en s'inspirant du [config.example.yml](./config.example.yml).

## Développement d'Harry
Harry est codé avec le langage  🚀 Rust 🚀.

Lorsque vous modifiez les fichiers d'Harry, vous pouvez le démarrer en utilisant le [compose.yml](./compose.yml) de développement.