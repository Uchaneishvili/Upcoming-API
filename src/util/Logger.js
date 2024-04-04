import winston from 'winston'
export class Logger {
  static infoLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  })

  static errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  })

  static error(msg, data) {
    this.errorLogger.error({
      timeStamp: new Date().toLocaleString(),
      message: msg,
      data,
    })
  }

  static info(msg, data) {
    this.infoLogger.info({
      timeStamp: new Date().toLocaleString(),
      message: msg,
      data,
    })
  }
}
