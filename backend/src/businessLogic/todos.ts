// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'
import { getTodosByUserId } from '../datalayer/todosAcess'
// // TODO: Implement businessLogic

export async function getTodosUser(userId: string) {
  return await getTodosByUserId(userId)
}

export function todoBuider(
  createTodoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
): TodoItem {
  const todoId = uuid.v4()
  const todo = {
    todoId: todoId,
    userId: getUserId(event),
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: '',
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  }
  return todo as TodoItem
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
) {
  return await updateTodo(
    {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    },
    userId,
    todoId
  )
}

export async function deleteTodo(todoId: string, userId: string) {
  return await deleteTodo(todoId, userId)
}
