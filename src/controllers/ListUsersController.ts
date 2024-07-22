import { Request, Response } from 'express';

import { UsersRepository } from '../repositories/UsersRepository';
import { CountUsersService } from '../services/CountUsersService';
import { ListUsersService } from '../services/ListUsersService';
import { PaginationLinks } from '../utils/PaginationLinks';

class ListUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const limit = 20;
    const { page = 1 } = request.query;
    const { currentUrl } = request;

    const listUsersService = new ListUsersService(UsersRepository);
    const countUsersService = new CountUsersService(UsersRepository);

    const [users, count] = await Promise.all([
      listUsersService.execute(Number(page), limit),
      countUsersService.execute(),
    ]);

    response.header('X-Total-Count', count.toString());

    const pagesTotal = Math.ceil(count / limit);
    if (pagesTotal > 1) {
      response.links(
        PaginationLinks.generate(Number(page), pagesTotal, currentUrl),
      );
    }

    return response.json(users);
  }
}

export { ListUsersController };
