# Black Friday Game

This is the game you can play on https://blackfriday.appvia.io/

Or watch our video about it[![Video](https://img.youtube.com/vi/Ij7IKrSFqas/0.jpg)](https://www.youtube.com/watch?v=Ij7IKrSFqas)

# deploy

```bash
npm i
SLS_DEBUG=* AWS_REGION=eu-west-2 aws-vault exec kore-sa-team-notprod --no-session -- serverless create_domain
SLS_DEBUG=* AWS_REGION=eu-west-2 aws-vault exec kore-sa-team-notprod --no-session -- serverless deploy
```
