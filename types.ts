export type User = {
  username: string;
  room: string;
  id: string;
  sid: string;
};

export type Author = Omit<User, 'sid'>;

export type Message = {
  author: Author;
  text: string;
  room: string;
  time?: string;
};
