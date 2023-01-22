import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const todosAccess = new TodosAccess();

// TODO: Implement businessLogic
export const getTodosForUser = async (userId: string) => {
  const todoItems = await todosAccess.getTodos(userId);
  return todoItems;
};

export const createTodo = async(newTodo, userId: string) => {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const newItem = {
    todoId,
    userId,
    createdAt,
    done: false,
    ...newTodo,
    attachmentUrl: `https://serverless-c4-todo-images-986834110086-dev.s3.amazonaws.com/no-image.png`
  };
  return await todosAccess.createTodo(newItem);
}

export const deleteTodo = async(userId: string, todoId: string) => {
  await todosAccess.deleteTodo(userId, todoId);
}

export const updateTodo = async(updatedData, userId: string, todoId: string) => {
  await todosAccess.updateTodo(updatedData, userId, todoId);
}