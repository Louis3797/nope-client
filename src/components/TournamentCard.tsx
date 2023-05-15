import { socketContext } from "@/context/SocketContext";
import { useTournamentStore } from "@/stores/useTournamentStore";
import { AvailableTournamentData, SocketCallback } from "@/types";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { Card, Button, Badge } from "react-daisyui";

const TournamentCard: React.FC<AvailableTournamentData & { name: number }> = ({
  name,
  id,
  currentSize,
  status,
  players,
  createdAt,
}) => {
  const router = useRouter();
  const socket = useContext(socketContext);

  const { enqueueSnackbar } = useSnackbar();

  const { setTournamentId, setCurrentSize, setStatus, setPlayers } =
    useTournamentStore((state) => ({
      status: state.status,
      players: state.players,
      setTournamentId: state.setTournamentId,
      setCurrentSize: state.setCurrentSize,
      setStatus: state.setStatus,
      setPlayers: state.setPlayers,
      setHost: state.setHost,
    }));

  const handleClick = () => {
    socket?.emit("tournament:join", id, (data: any) => {
      console.log("join", data);
      if (data?.success) {
        const playerData: { id: string; username: string; score: number }[] =
          [];
        for (let player of data?.data?.players) {
          playerData.push(Object.assign(player, { score: 0 }));
        }

        setPlayers(playerData);
        setCurrentSize(data?.data?.currentSize);
        setStatus("WAITING_FOR_MORE_PLAYERS");
        setTournamentId(data?.data?.tournamentId);

        router.push(`tournament/${id}`);
      } else {
        enqueueSnackbar(data?.error?.message, { variant: "error" });
        console.log(`Cannot join room with id: ${id}`);
      }
    });
  };

  return (
    <Card className="shadow-sm bg-slate-100">
      <Card.Body>
        <Card.Title tag="h2">Tournament: {name}</Card.Title>
        <div className="flex flex-row gap-2">
          {players.map((p, idx) => {
            return <Badge key={idx}>{p.username}</Badge>;
          })}
        </div>
        <p className="text-sm text-slate-700">
          Created {moment(createdAt).fromNow(true)} ago
        </p>

        <Card.Actions className="justify-end">
          <Button color="primary" onClick={handleClick}>
            Join
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};

export default TournamentCard;
