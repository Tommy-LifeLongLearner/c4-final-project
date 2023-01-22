import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

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

  async createTodo(newItem): Promise<TodoItem> {
    try {
      await this.client.put({
        TableName: todosTable,
        Item: newItem
      }).promise();
  
      return newItem;
    }catch(err) {
      logger.error({
        func: "TodosAccess.createTodo",
        err: err.message,
        params: {
          newItem
        }
      });
    }
  }

  async deleteTodo(userId: string, todoId: string) {
    try {
      await this.client.delete({
        TableName: todosTable,
        Key: {
          userId,
          todoId
        }
      }).promise();
    }catch(err) {
      logger.error({
        func: "TodosAccess.deleteTodo",
        err: err.message,
        params: {
          todoId,
          userId
        }
      });
    }
  }

  async updateTodo(updatedData: TodoUpdate, userId: string, todoId: string) {
    try {
      await this.client.update({
        TableName: todosTable,
        ExpressionAttributeNames: {
          "#N": "name", 
          "#DD": "dueDate",
          "#D": "done"
        },
        ExpressionAttributeValues: {
          ":n": updatedData.name, 
          ":dd": updatedData.dueDate,
          ":d": updatedData.done
        },
        UpdateExpression: "SET #N = :n, #DD = :dd, #D = :d",
        Key: {
          userId,
          todoId
        }
      }).promise();
    }catch(err) {
      logger.error({
        func: "TodosAccess.updateTodo",
        err: err.message,
        params: {
          todoId,
          userId,
          updatedData
        }
      });
    }
  }
}