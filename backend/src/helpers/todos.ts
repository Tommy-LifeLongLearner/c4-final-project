import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
// import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const todosAccess = new TodosAccess();

// TODO: Implement businessLogic
export const getTodosForUser = async (userId: string) => {
  const todoItems = await todosAccess.getTodos(userId);
  return todoItems;
};