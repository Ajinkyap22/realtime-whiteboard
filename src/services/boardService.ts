import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const createBoard = async (
  boardId: string,
  boardName: string,
  user: string
) => {
  const response = await axiosInstance.post("/create-board", {
    boardId,
    boardName,
    user,
  });

  return response.data;
};

export const addParticipant = async (boardId: string, user: string) => {
  const response = await axiosInstance.post("/add-participants/" + boardId, {
    participant: user,
  });

  return response.data;
};

export const getMyBoards = async (user: string) => {
  const response = await axiosInstance.get("/get-my-boards/" + user);

  return response.data;
};

export const getJoinedBoards = async (user: string) => {
  const response = await axiosInstance.get("/get-participated-board/" + user);

  return response.data;
};

export const deleteBoard = async (boardId: string, user: string) => {
  const response = await axiosInstance.post("/delete-board", {
    boardId: boardId,
    userEmail: user,
  });

  return response.data;
};

export const doesUserHaveBoards = async (user: string) => {
  const response = await axiosInstance.get("/user-has-boards/" + user);

  return response.data.hasBoards;
};

export const saveBoardIdTracker = async (boardId: string, hostType: string) => {
  const response = await axiosInstance.post("/save-board-id-tracker", {
    boardId,
    hostType,
  });

  return response.data;
};

export const checkValidBoardId = async (boardId: string) => {
  const response = await axiosInstance.get("/validate-boardid/" + boardId);

  return response.data;
};

export const updateBoard = async (
  boardId: string,
  boardName: string,
  boardData: string
) => {
  const response = await axiosInstance.post("/update-board", {
    boardId,
    boardName,
    boardData,
  });

  return response.data;
};
