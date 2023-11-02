export type Board = {
  name?: string;
  id?: string;
  boardId?: string;
  host?: string;
  boardName?: string;
  participants?: string[];
  remainingCount?: number | null;
  oneParticipantName?: string | null;
  boardData?: any;
};
