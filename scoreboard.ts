import * as AWS from 'aws-sdk'
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.SCORE_TABLE
import {
  Context,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2
} from 'aws-lambda'

export async function scoreboard (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> {
  const scores = (
    await dynamoDb
      .scan({
        TableName,
        ProjectionExpression: 'handle, score'
      })
      .promise()
  ).Items.filter(item => item.score > 646.3999999992666).sort((a, b) =>
    a.score > b.score ? -1 : 0
  )

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scores)
  }
}
