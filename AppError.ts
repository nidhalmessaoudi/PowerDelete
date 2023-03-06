export default class AppError {
  constructor(public error: Error, public path: string) {}
}
