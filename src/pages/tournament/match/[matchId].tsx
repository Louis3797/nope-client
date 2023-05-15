import { useRouter } from "next/router";
import React from "react";

const Match = () => {
  const router = useRouter();

  const { matchId } = router.query;
  return <div>Match {matchId}</div>;
};

export default Match;
