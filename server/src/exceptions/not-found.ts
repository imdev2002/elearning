class NotFoundException extends Error {
  status = 404;
  message: string;
  constructor(resource: string, id: number | string) {
    super(`${resource} with id ${id} not found`);
    this.message = `${resource} with id ${id} not found`;
  }
}

export default NotFoundException;
