import { forwardRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import axios from "axios";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { ipfsClient } from "~~/utils/simpleNFT";

export const ModalSteps = forwardRef((props, ref) => {
  const { address } = useAccount();
  const [uploadedIpfsPath, setUploadedIpfsPath] = useState<string>();
  const [nodeId, setNodeId] = useState<string>();
  const router = useRouter();

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "safeMint",
    args: [address, uploadedIpfsPath, nodeId],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      router.push("/host");
    },
  });

  const handleIpfsUpload = useCallback(async (nodeId: string) => {
    const metadata = {
      nodeId,
    };
    const notificationId = notification.loading("Metadata uploading to IPFS...");
    try {
      const uploadedItem = await ipfsClient.add(JSON.stringify(metadata));
      notification.remove(notificationId);
      notification.success("Metadata created to IPFS");

      setUploadedIpfsPath(uploadedItem.path);
    } catch (error) {
      notification.remove(notificationId);
      notification.error("Error uploading to IPFS");
      console.log(error);
    } finally {
    }
  }, []);

  useEffect(() => {
    if (uploadedIpfsPath && nodeId) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedIpfsPath, nodeId]);

  const validateNodeId = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v0/id");
      if (response.status === 200 && response.data) {
        const nodeId = response.data;
        return nodeId;
      }
      notification.error(`It looks you haven't follow the steps to be a host`);
    } catch (error) {
      notification.error(`It looks you haven't follow the steps to be a host`);
    }
  }, []);

  const beAHost = useCallback(async () => {
    // const nodeId = await validateNodeId();
    const nodeId = "1";
    setNodeId(nodeId);
    if (nodeId) {
      handleIpfsUpload(nodeId);
      ref.current.close();
    }
  }, [handleIpfsUpload, ref, validateNodeId]);

  return (
    <dialog ref={ref} id="my_modal_1" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Follow these instructions to be a host</h3>

        <ol
          className="p-3 prose"
          style={{
            listStyleType: "auto",
          }}
        >
          <li>Please confirm your IPFS node and the plug-in are running.</li>
        </ol>
        <div className="modal-action">
          <Button onClick={beAHost}>Be a Host</Button>
        </div>
      </div>
    </dialog>
  );
});

ModalSteps.displayName = "ModalSteps";
