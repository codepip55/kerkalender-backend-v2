import { User } from '../../users/schemas/user.schema';
import { Service } from '../../services/schemas/services.schema';

export class Request {
  team: {
    name: string;
    positions: {
      name: string;
      users: {
        user: User;
        status: 'accepted' | 'waiting' | 'declined';
      }[];
    }[];
  };
  position: {
    name: string;
    users: {
      user: User;
      status: 'accepted' | 'waiting' | 'declined';
    }[];
  };
  service: Service;
  status: 'accepted' | 'waiting' | 'declined';
  user: User;
}
