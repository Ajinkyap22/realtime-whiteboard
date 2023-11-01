export type Board = {
  name?: string;
  id?: string;
  boardId?: string;
  hostID?: {
    _id?: string;
    name?: string;
  };
  boardName?: string;
  participants?: string[];
  remainingCount?: number | null;
  oneParticipantName?: string | null;
  boardData?: string;
};
