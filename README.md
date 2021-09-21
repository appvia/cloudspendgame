- [x] generate request timeseries data
- [x] calculate necessary cpu+memory for requests
- [x] calculate necessary replicas
- [x] calculate necessary cpu+memory for replicas
- [x] calculate necessary nodes
- [x] calculate desired replicas
- [x] calculate desired nodes
- [x] calculate ready nodes
- [x] calculate ready pods
- [x] calculate capacity from ready pods
- [x] calculate failed requests from delta of ready to needed
- [x] calculate compute costs
- [ ] allow configuring readiness tests

# deploy

```bash
npm i
SLS_DEBUG=* AWS_REGION=eu-west-2 aws-vault exec kore-sa-team-notprod --no-session -- serverless create_domain
SLS_DEBUG=* AWS_REGION=eu-west-2 aws-vault exec kore-sa-team-notprod --no-session -- serverless deploy
```
