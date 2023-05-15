import { MatchInviteData } from "@/types";
import React from "react";
import { Modal, Button } from "react-daisyui";

interface InviteModalProps {
  inviteData: MatchInviteData | null;
  visible: boolean;
  handleReject: () => void;
  handleAccept: () => void;
}
const InviteModal: React.FC<InviteModalProps> = ({
  inviteData,
  visible,
  handleAccept,
  handleReject,
}) => {
  return (
    <>
      <Modal open={visible}>
        <Modal.Header className="text-4xl font-bold">Match Found</Modal.Header>

        <Modal.Body>
          {inviteData?.players[0].username} {"  vs.  "}{" "}
          {inviteData?.players[1].username}
        </Modal.Body>

        <div className="flex flex-row justify-end gap-5">
          <Modal.Actions>
            <Button color="error" onClick={handleReject}>
              Reject
            </Button>
          </Modal.Actions>

          <Modal.Actions>
            <Button color="primary" onClick={handleAccept}>
              Accept
            </Button>
          </Modal.Actions>
        </div>
      </Modal>
    </>
  );
};

export default InviteModal;
