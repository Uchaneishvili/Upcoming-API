import { Logger } from './Logger.js'

export const ResponseStatusCodes = {
  Success: 200,
  InternalServerError: 500,
  NotFound: 404,
  Created: 201,
  BadRequest: 400,
  Conflict: 409,
}

export function successResponse(data, res) {
  res.status(ResponseStatusCodes.Success).json({
    status: 'SUCCESS',
    data,
  })
}

export function createdResponse(data, res) {
  res.status(ResponseStatusCodes.Created).json({
    status: 'SUCCESS',
    data,
  })
}

export function failureResponse(message, data, res) {
  res.status(ResponseStatusCodes.Success).json({
    status: 'FAILURE',
    message,
    data,
  })
}

export function insufficientParameters(res, keys = []) {
  res.status(ResponseStatusCodes.BadRequest).json({
    status: 'FAILURE',
    message: `Insufficient parameters: ${keys.join(', ')}`,
    data: {},
  })
}

export function handleError(err, res, message) {
  const error = {
    status: 'FAILURE',
    message: message || 'MongoDB error',
    err,
  }
  Logger.error(error)
  res.status(ResponseStatusCodes.InternalServerError).json(error)
}

export function invalidParameters(res, keys, additionalMsg = '') {
  if (additionalMsg) {
    additionalMsg = ` ${additionalMsg}`
  }

  if (typeof keys === 'string') {
    keys = [keys]
  }

  keys = keys || []

  res.status(ResponseStatusCodes.BadRequest).json({
    status: 'FAILURE',
    message: `Invalid parameters: ${keys.join(', ')}.${additionalMsg}`,
    data: {},
  })
}

export function recordNotFound(res) {
  res.status(ResponseStatusCodes.NotFound).json({
    status: 'FAILURE',
    message: `Record Not Found.`,
    data: {},
  })
}

export function recordAlreadyExists(res) {
  res.status(ResponseStatusCodes.Conflict).json({
    status: 'FAILURE',
    message: `Record already exists with given properties`,
    data: {},
  })
}
