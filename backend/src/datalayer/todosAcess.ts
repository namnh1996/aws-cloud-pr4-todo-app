import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const todoIndex = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()
// // TODO: Implement the dataLayer logic
export async function createTodo(todoItem: TodoItem): Promise<TodoItem> {
  logger.info('create todo')
  await docClient
    .put({
      TableName: todosTable,
      Item: todoItem
    })
    .promise()

  return todoItem
}

export async function getTodosByUserId(userId: string): Promise<TodoItem[]> {
  logger.info('get todo by user id')
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()
  return result.Items as TodoItem[]
}

export async function getTodoById(todoId: string): Promise<TodoItem> {
  logger.info('get todo by id')
  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: todoIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    })
    .promise()
  return result.Items[0] as TodoItem
}

export async function updateTodo(todoItem: TodoItem): Promise<TodoItem> {
  logger.info('update todo')
  const result = await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId: todoItem.userId,
        todoId: todoItem.todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': todoItem.attachmentUrl
      }
    })
    .promise()
  return result.Attributes as TodoItem
}

export async function deleteTodo(todoId: string, userId: string) {
  logger.info('delete todo')
  await docClient
    .delete(
      {
        TableName: todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      },
      (error) => {
        if (error) {
          throw new Error('')
        }
      }
    )
    .promise()
}

function createDynamoDBClient(): any {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a DynamoDB')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
