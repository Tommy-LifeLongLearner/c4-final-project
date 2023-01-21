import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE;
const todosIndex = process.env.TODOS_CREATED_AT_INDEX;

const logger = createLogger('TodosAccess');
export interface TodosAccess {
  client: any
}

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor() {
    this.client = new XAWS.DynamoDB.DocumentClient();
  }

  async getTodos(userId: string): Promise<TodoItem []> {
    try {
      const result = await this.client.query({
        TableName: todosTable,
        Index: todosIndex, 
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise();
  
      return result.Items;
    }catch(err) {
      logger.error({
        func: "TodosAccess.getTodos",
        err: err.message,
        params: {
          userId
        }
      });
    }
  }
}