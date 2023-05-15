import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import React, { useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import { Button } from "react-daisyui";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { AvailableTournamentData, SocketCallback } from "@/types";
import TournamentCard from "@/components/TournamentCard";
import { faker } from "@faker-js/faker";
import { socketContext } from "@/context/SocketContext";
import { useSnackbar } from "notistack";
import { useTournamentStore } from "@/stores/useTournamentStore";
import useAuthProvider from "@/hook/useAuthProvider";

const Home: NextPage = () => {
  const socket = useContext(socketContext);
  const { user } = useAuthProvider();
  const router = useRouter();
  const { setTournamentId, setCurrentSize, setStatus, setPlayers, setHost } =
    useTournamentStore((state) => ({
      setTournamentId: state.setTournamentId,
      setCurrentSize: state.setCurrentSize,
      setStatus: state.setStatus,
      setPlayers: state.setPlayers,
      setHost: state.setHost,
    }));
  const { enqueueSnackbar } = useSnackbar();

  const [tournaments, setTournaments] = useState<AvailableTournamentData[]>([]);

  const handleCreateTournament = () => {
    const numBestOfMatches: string | null = prompt(
      "How much Best of matches should each match have (only odd numbers pls)?"
    );

    if (!numBestOfMatches) alert("Error on best of input");

    socket?.emit("tournament:create", Number(numBestOfMatches), (data: any) => {
      console.log(data);
      if (data?.success) {
        console.info("Created Tournament with id: " + data.data.tournamentId);

        // set tournament store
        setTournamentId(data.data.tournamentId);
        setCurrentSize(1);
        setStatus("WAITING_FOR_MORE_PLAYERS");
        setPlayers([{ id: user?.id!, username: user?.username!, score: 0 }]);
        setHost({ id: user?.id!, username: user?.username! });

        enqueueSnackbar("You successfully created a tournament", {
          variant: "success",
        });
        router.push(`/tournament/${data.data.tournamentId}`);
      } else {
        enqueueSnackbar(data?.error?.message, { variant: "error" });
        console.error("Error on Tournament creation: ", data?.error);
      }
    });
  };

  useEffect(() => {
    // for (let index = 0; index < 20; index++) {
    //   const players: { username: string }[] = Array(3)
    //     .fill(1)
    //     .map((_i) => {
    //       return { username: faker.name.fullName() };
    //     });
    //   const data: AvailableTournamentData = {
    //     id: String(index),
    //     players: players,
    //     status: "WAITING_FOR_MORE_PLAYERS",
    //     currentSize: 1,
    //     createdAt: new Date(),
    //   };

    socket?.on("list:tournaments", (data: AvailableTournamentData[]) => {
      console.log("tournament list:", data);
      setTournaments(data);
    });
  }, [socket]);

  return (
    <>
      <Layout>
        <main className="flex flex-col items-center justify-center w-screen h-screen">
          <div className="flex flex-col w-2/5 h-4/5">
            <div className="flex flex-row items-center justify-between w-full px-3 mb-4 h-14">
              <p className="text-2xl font-semibold">Available Tournaments</p>
              <Button size="sm" color="accent" onClick={handleCreateTournament}>
                Create new Tournament
              </Button>
            </div>
            <div className="flex flex-col w-full h-full gap-4 overflow-scroll">
              {tournaments.map((t, idx) => {
                return <TournamentCard key={idx} name={idx} {...t} />;
              })}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Home;
