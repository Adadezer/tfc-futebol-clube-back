import { NextFunction, Request, Response } from 'express';
import ILogin from '../../interfaces/ILogin';
import UserService from '../services/userService';

export default class UserController {
  constructor(private userService: UserService) {}

  public async getUser(req: Request, res: Response): Promise<Response | void> {
    const { decoded: { data } } = req.body;
    // console.log('data: ', data);
    const user = await this.userService.getUser(data);
    // console.log('userGet controller:', user);
    return res.status(200).json(user);
  }

  public async getLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const login: ILogin = { email, password };

      const user = await this.userService.getLogin(login);

      if (!user) {
        return res.status(401).json({ message: 'email or password not exist' });
      }
      // console.log('user maldito: ', user);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
