"use client";

import React, { useEffect, useState } from "react";

import { useBoundStore } from "@/zustand/store";
import { useSession } from "next-auth/react";
import uniqid from "uniqid";
import { Box, Button, VStack, useToast } from "@chakra-ui/react";
import { CursorUpdate, ProfileData, SpaceMember } from "@ably/spaces";
import { useMutation, useQuery } from "react-query";

import InitModal from "@/app/board/components/InitModal";
import Cursor from "@/app/board/components/Cursor";
import Whiteboard from "@/app/board/components/Whiteboard";
import Navbar from "@/app/components/Navbar";

import { getSpace, subscribeTheUser } from "@/app/config/ably";

import type { UserEvent } from "@/app/types/UserEvent";
import { AblySpaceEventIdentifiers } from "@/app/types/AblySpaceEventIdentifiers";
import type { MembersLocation } from "@/app/types/MembersLocation";

import {
  addParticipant,
  checkValidBoardId,
  updateBoard,
} from "@/services/boardService";
import Loading from "@/app/loading";
import InvalidBoardModal from "@/app/board/components/InvalidBoardModal";
import { Types } from "ably";

type Props = {
  params: {
    id: string;
  };
};

const Board = ({ params }: Props) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [membersLocation, setMembersLocation] = useState<MembersLocation[]>([]);

  const { data: session, status } = useSession();

  const guestUser = useBoundStore((state) => state.guestUser);
  const clientId = useBoundStore((state) => state.clientId);
  const setClientId = useBoundStore((state) => state.setClientId);
  const setGuestUser = useBoundStore((state) => state.setGuestUser);
  const setBoard = useBoundStore((state) => state.setBoard);
  const board = useBoundStore((state) => state.board);
  const [boardIdTracker, setBoardIdTracker] = useState<{
    isValid: boolean;
    hostType: string;
  } | null>(null);

  const toast = useToast();

  const addParticipantMutation = useMutation(
    ({ id, user }: { id: string; user: string }) => addParticipant(id, user)
  );

  const updateBoardMutation = useMutation(
    ({
      boardId,
      boardName,
      boardData,
    }: {
      boardId: string;
      boardName: string;
      boardData: string;
    }) => updateBoard(boardId, boardName, boardData)
  );

  const { isError: boardIdError, isLoading: validatingBoard } = useQuery(
    ["checkValidBoardId", params.id],
    () => checkValidBoardId(params.id),
    {
      retry: false,
      onSuccess: (data) => {
        setBoardIdTracker(data);
      },
    }
  );

  const getToastTitleForUserEvent = (event: string) => {
    switch (event) {
      case AblySpaceEventIdentifiers.PRESENT:
        return "entered";
      case AblySpaceEventIdentifiers.LEAVE:
        return "left";
    }
  };

  const handleUserEvent = (message: UserEvent) => {
    const newMembers = message.members;
    newMembers.sort((a, b) => {
      return a.lastEvent.timestamp - b.lastEvent.timestamp;
    });

    const lastUser = newMembers[newMembers.length - 1];
    const eventHappened = getToastTitleForUserEvent(lastUser.lastEvent.name);

    if (eventHappened === "entered") {
      const uniqueMembers = newMembers.filter(
        (member, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.clientId === member.clientId &&
              t.profileData?.name === member.profileData?.name
          )
      );
      setMembers(uniqueMembers);

      setMembersLocation(
        uniqueMembers.map((member) => {
          return {
            member: member,
            x: 0,
            y: 0,
          };
        })
      );
    } else if (eventHappened === "left") {
      setMembers((prevMembers) => {
        return prevMembers.filter((member) => {
          return member.clientId !== lastUser.clientId;
        });
      });

      setMembersLocation((prevMembersLocation) => {
        return prevMembersLocation.filter((memberLocation) => {
          return memberLocation.member.clientId !== lastUser.clientId;
        });
      });
    }

    toast({
      description:
        lastUser.clientId.split("&")[1] + " " + eventHappened + " the room",
      duration: 2000,
      isClosable: false,
      position: "bottom-left",
      variant: "left-accent",
    });
  };

  const handleCursorEvent = (cursorEvent: CursorUpdate) => {
    setMembersLocation((prevMembersLocation) => {
      return prevMembersLocation.map((memberLocation) => {
        if (memberLocation.member.clientId === cursorEvent.clientId) {
          return {
            ...memberLocation,
            x: cursorEvent.position.x,
            y: cursorEvent.position.y,
          };
        }

        return memberLocation;
      });
    });
  };

  const handleCanvaEvent = (message: Types.Message) => {
    // TODO: get the data as string and parse it and provide that to canva
    console.log("canvaData", message.data);
  };

  const handleAblyConnection = async () => {
    if (validatingBoard) return;
    if (!boardIdTracker?.isValid) return;
    if (boardIdError) return;
    if (!clientId) return;

    const profileData: ProfileData = {
      name: session?.user?.name ? session?.user?.name : guestUser,
      email: session?.user?.email ? session?.user?.email : guestUser,
      avatar: session?.user?.image ? session?.user?.image : "",
    };

    const space = await subscribeTheUser(clientId!, params.id, profileData);

    space.subscribe((message) => {
      console.log("userEvent", message);
      handleUserEvent(message);
    });

    space.channel.subscribe("canvaEvent", (message) => {
      handleCanvaEvent(message);
    });

    space.cursors.subscribe("update", (cursorEvent) => {
      handleCursorEvent(cursorEvent);
    });

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      space.cursors.set({ position: { x: clientX, y: clientY } });
    });
  };

  const handlePublishEvent = async () => {
    const space = await getSpace(clientId!, params.id);
    // TODO: publish the board data
    await space.channel.publish("canvaEvent", "hello world");
  };

  const handleLeaveBoard = async () => {
    setGuestUser(null);
    setClientId(null);
    setBoard(null);

    if (status === "authenticated") {
      window.location.href = "/boards";
    } else {
      window.location.href = "/";
    }
  };

  const handleSaveBoard = () => {
    updateBoardMutation.mutate({
      boardId: params.id,
      boardName: board?.name as string,
      boardData: board?.boardData as string,
    });
  };

  useEffect(() => {
    if (status === "authenticated" && boardIdTracker?.hostType === "user") {
      handleSaveBoard();
    }
    // TODO: add dependency of board data
  }, [boardIdTracker, status]);

  useEffect(() => {
    if (status === "authenticated" || !!guestUser) handleAblyConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, guestUser, clientId, boardIdTracker?.isValid]);

  useEffect(() => {
    if (!guestUser && !session?.user?.name) return;

    if (!clientId) {
      setClientId(
        session?.user?.email
          ? session?.user?.email +
              "&" +
              session?.user?.name?.split(" ")[0] +
              "&user"
          : uniqid() + "&" + guestUser?.split(" ")[0] + "&guest"
      );
    }
  }, [clientId, session, guestUser, setClientId]);

  // add participants to the board
  useEffect(() => {
    if (status === "authenticated" && boardIdTracker?.hostType === "user") {
      addParticipantMutation.mutate({
        id: params.id,
        user: session?.user?.email as string,
      });
    }
  }, [boardIdTracker, status]);

  return (
    <>
      {validatingBoard ? (
        <Loading />
      ) : (
        <VStack minH="full" w="full" position="relative">
          {boardIdError || boardIdTracker?.isValid === false ? (
            <InvalidBoardModal />
          ) : (
            <>
              <Navbar members={members} handleLeaveBoard={handleLeaveBoard} />

              <Whiteboard />

              {/* Cursor */}
              {membersLocation && membersLocation.length > 0 ? (
                <Box>
                  {membersLocation.map((memberLocation) => {
                    if (memberLocation.member.clientId === clientId) {
                      return null;
                    }

                    return (
                      <VStack
                        key={memberLocation.member.clientId}
                        position="absolute"
                        left={memberLocation.x + "px"}
                        top={memberLocation.y + "px"}
                        zIndex={1000}
                        alignItems="center"
                      >
                        <Cursor />
                        <p>
                          {memberLocation.member?.profileData?.name as string}
                        </p>
                      </VStack>
                    );
                  })}
                </Box>
              ) : null}
            </>
          )}

          {status === "unauthenticated" && !guestUser && <InitModal />}
        </VStack>
      )}
    </>
  );
};

export default Board;
