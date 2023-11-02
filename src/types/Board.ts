export type Board = {
  name?: string;
  id?: string;
  boardId?: string;
  hostID?: {
    _id: string;
    name: string;
  };
  host?: string;
  boardName?: string;
  participants?: string[];
  remainingCount?: number | null;
  oneParticipantName?: string | null;
  boardData?: any;
};
