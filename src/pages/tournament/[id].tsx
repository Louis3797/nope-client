import InviteModal from "@/components/InviteModal";
import Layout from "@/components/Layout";
import { socketContext } from "@/context/SocketContext";
import { useAuth } from "@/hook/useAuth";
import { useGameStateStore } from "@/stores/useGameState";
import { useTournamentStore } from "@/stores/useTournamentStore";
import {
  GameStatePayload,
  MatchInfoPayload,
  MatchInviteCallBack,
  MatchInviteData,
  Move,
  TournamentInfoPayload,
  TournamentStatus,
} from "@/types";
import { faker } from "@faker-js/faker";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Button, Modal } from "react-daisyui";

const Room: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const { user } = useAuth();

  const {
    status,
    players,
    setTournamentId,
    setCurrentSize,
    setStatus,
    setPlayers,
    setHost,
    setWinner,
    clear,
  } = useTournamentStore((state) => ({
    status: state.status,
    players: state.players,
    setTournamentId: state.setTournamentId,
    setCurrentSize: state.setCurrentSize,
    setStatus: state.setStatus,
    setPlayers: state.setPlayers,
    setHost: state.setHost,
    setWinner: state.setWinner,
    clear: state.clear,
  }));

  const [showModal, setShowModal] = useState<boolean>(false);
  const [inviteData, setInviteData] = useState<MatchInviteData | null>(null!);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  const { gameState, setGameState } = useGameStateStore((state) => ({
    gameState: state.gameState,
    setGameState: state.setGameState,
  }));

  const { enqueueSnackbar } = useSnackbar();

  const socket = useContext(socketContext);

  useEffect(() => {
    socket?.on(
      "tournament:playerInfo",
      (data: {
        message: string;
        tournamentId: string;
        currentSize: number;
        bestOf: number;
        players: { id: string; username: string }[];
      }) => {
        const playerData: { id: string; username: string; score: number }[] =
          [];
        for (let player of data.players) {
          playerData.push(Object.assign(player, { score: 0 }));
        }

        setPlayers(playerData);
        setCurrentSize(data.currentSize);

        enqueueSnackbar(data.message, { variant: "info" });
      }
    );

    socket?.on("tournament:info", (data: TournamentInfoPayload) => {
      setTournamentId(data.tournamentId);
      setCurrentSize(data.currentSize);
      setStatus(data.status as TournamentStatus);
      setPlayers(data.players);
      setHost(data.host);
      setWinner(data.winner);

      enqueueSnackbar(data?.message, { variant: "info" });
    });

    let timeout: any;

    socket?.on("match:invite", (data, cb) => {
      console.log(data);
      // if (!user) {
      //   cb({ accepted: true, id: "Hello World" });
      // } else {
      //   cb({ accepted: true, id: user.id });
      // }
      cb({ accepted: true, id: user?.id });
      // const now = new Date().getTime();
      // const timeLeftInMs = data.invitationTimeout - now;
      // const timeLeft = Math.ceil(timeLeftInMs / 1000);
      // console.log(timeLeft);
      // console.log(timeLeftInMs);
      // setInviteData(data);
      // setShowModal(true);

      // console.log("outer", acknowledged);
      // timeout = setTimeout(() => {
      //   console.log(acknowledged);
      //   setShowModal(false);
      //   cb({ accepted: acknowledged, id: user?.id });
      //   if (acknowledged) {
      //     router.push(`/tournament/${id}/match/${inviteData?.matchId}`);
      //   }
      //   setInviteData(null);
      //   setAcknowledged(true);
      // }, timeLeftInMs - 1000);
    });

    socket?.on("match:info", (data: MatchInfoPayload) => {
      if (data?.message) {
        enqueueSnackbar(data?.message, { variant: "info" });
      }
    });

    socket?.on("game:state", async (data) => {
      console.log(data);
      await new Promise((resolve) => {
        setGameState(data);
        resolve(gameState);
      });
      console.log("game:state", gameState);
    });

    socket?.on(
      "game:makeMove",
      async (
        data: {
          message: string;
          timeout: number;
        },
        ack
      ) => {
        enqueueSnackbar(data?.message, { variant: "default" });

        await calculateMove().then((move) => {
          console.log(move);
          if (move) {
            ack(move);
          }
        });
      }
    );
    return () => {
      clearTimeout(timeout);
      socket?.off("game:state");
      socket?.off("game:makeMove");
      socket?.off("match:info");
      socket?.off("tournament:playerInfo");
      socket?.off("tournament:info");
      socket?.off("match:invite");
    };
  }, [socket, acknowledged]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        socket?.emit("tournament:leave", (data: any) => {
          console.log("leave", data);
          clear();
          enqueueSnackbar(
            data?.success ? "You leaved successfully" : "Error on leaving",
            { variant: data?.success ? "info" : "error" }
          );
        });
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  const calculateMove = async (): Promise<Move | undefined> => {
    if (!gameState) {
      return undefined;
    }
    const topCard = gameState.topCard;

    const hand = gameState.hand;

    console.log(topCard);
    console.log("hand", hand);

    const cardsToPlay = hand.filter((c) => c.color === topCard.color);

    if (cardsToPlay.length < topCard.value!) {
      // take or nope

      if (gameState.lastMove !== null && gameState.lastMove.type === "take") {
        return {
          type: "nope",
          card1: null,
          card2: null,
          card3: null,
          reason: "",
        };
      } else {
        return {
          type: "take",
          card1: null,
          card2: null,
          card3: null,
          reason: "",
        };
      }
    } else {
      const move: Move = {
        type: "put",
        card1: cardsToPlay.shift() ?? null,
        card2: cardsToPlay.shift() ?? null,
        card3: cardsToPlay.shift() ?? null,
        reason: "",
      };

      return move;
    }
  };
  const handleStart = () => {
    socket?.emit("tournament:start", (ack: any) => {
      if (ack?.success) {
        enqueueSnackbar("Tournament Started", { variant: "success" });
      } else if (!ack?.success) {
        enqueueSnackbar(ack?.error?.message, { variant: "error" });
      }
    });
  };

  const handleLeave = () => {
    socket?.emit("tournament:leave", (data: any) => {
      if (data?.success) {
        router.push("/");
        clear();
        enqueueSnackbar("You leaved successfully", { variant: "info" });
      } else {
        enqueueSnackbar(data.data.message, { variant: "error" });
      }
    });
  };

  const handleAccept = () => {
    setShowModal(false);
    setInviteData(null);
    setAcknowledged(true);
  };

  const handleReject = () => {
    setShowModal(false);
    setInviteData(null);
    setAcknowledged(false);
  };

  return (
    <>
      <Layout>
        <InviteModal
          inviteData={inviteData}
          visible={showModal}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
        <div className="flex flex-col items-center justify-around w-screen h-screen">
          <div className="flex flex-row justify-between w-full px-8 mt-5 h-36">
            <div className="flex flex-col w-auto h-full gap-3 ">
              <Badge size="lg" color="ghost" className="font-semibold text-md">
                Tournament: {id}
              </Badge>
              <Badge
                size="lg"
                color="ghost"
                className="font-semibold capitalize"
              >
                {"Status:  "}
                {status.replaceAll("_", " ").toLowerCase()}
              </Badge>
            </div>

            <Button size="sm" color="accent" className="" onClick={handleStart}>
              Start Tournament
            </Button>
          </div>
          <div className="flex flex-col w-2/5 mt-16 h-4/5">
            <div className="flex flex-row items-center justify-between w-full px-3 mb-4 h-14">
              <p className="text-2xl font-semibold">Player List</p>
              <Button size="sm" onClick={handleLeave}>
                Leave
              </Button>
            </div>
            <div className="flex flex-col w-full h-full gap-4 px-3 overflow-scroll">
              {players.map((p, idx) => {
                return (
                  <div
                    className="flex flex-row items-center justify-between w-full px-3 py-2 rounded-md shadow-md bg-slate-100 hover:bg-slate-200"
                    key={idx}
                  >
                    <p className="text-lg font-medium text-center">
                      {p.username}{" "}
                      {user?.username === p.username ? (
                        <span className="text-sm font-normal text-grey-600">
                          {"(You)"}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                    <p className="text-lg font-medium">Score: {p.score}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Room;
