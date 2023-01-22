import { TodosAccess } from './todosAcess'
import { generateSignedURL } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess();
const bucketName = process.env.ATTACHMENT_S3_BUCKET;

// TODO: Implement businessLogic
export const getTodosForUser = async (userId: string): Promise<TodoItem []> => {
  const todoItems = await todosAccess.getTodos(userId);
  return todoItems;
};

export const createTodo = async(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> => {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const newItem = {
    todoId,
    userId,
    createdAt,
    done: false,
    ...newTodo,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${userId}.${todoId}`
  };
  return await todosAccess.createTodo(newItem);
}

export const deleteTodo = async(userId: string, todoId: string) => {
  await todosAccess.deleteTodo(userId, todoId);
}

export const updateTodo = async(updatedData: UpdateTodoRequest, userId: string, todoId: string) => {
  await todosAccess.updateTodo(updatedData, userId, todoId);
}

export const createAttachmentPresignedUrl = async(userId: string, todoId: string) => {
  return generateSignedURL(userId, todoId);
}