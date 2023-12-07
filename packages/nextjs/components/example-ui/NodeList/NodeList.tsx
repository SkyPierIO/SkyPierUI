import { RefObject, useEffect, useRef, useState } from "react";
import { JoinSteps } from "./JoinSteps";
import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import { Button } from "~~/components/ui/Button";
import { notification } from "~~/utils/scaffold-eth";

export const NodeList = () => {
  const dialogRef = useRef<RefObject<HTMLDivElement> | undefined>();
  const [nodesStatus, setNodesStatus] = useState<any>({});
  const [vpnData, setVpnData] = useState<any>({});
  const NODES_GRAPHQL = `
  {
    registrations(filter: { active: true }, orderBy: createdAt) {
      address
    	nodeId
    }
  }
  `;

  const NODES_GQL = gql(NODES_GRAPHQL);
  const nodesData = useQuery(NODES_GQL, { pollInterval: 1000 });

  useEffect(() => {
    if (nodesData.data) {
      const uniqueNodes = nodesData.data.registrations.filter(
        (node: any, index: any, self: any) =>
          node.nodeId && node.nodeId.length > 43 && index === self.findIndex(item => item.nodeId === node.nodeId),
      );
      // Make requests for each item to this endpoint http://localhost:8081/api/v0/ping/{nodeId}
      // Function to make a request for an item
      const fetchItem = async itemId => {
        try {
          const response = await axios.get(`http://localhost:8081/api/v0/ping/${itemId}`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching item ${itemId}: ${error}`);
          return null;
        }
      };

      // Use Promise.all to make multiple requests in parallel
      const requests = uniqueNodes.map(item => fetchItem(item.nodeId));

      Promise.all(requests)
        .then(responses => {
          setNodesStatus(responses);
        })
        .catch(error => {
          console.error("Error making requests:", error);
        });
    }
  }, [nodesData.data]);

  const join = async (nodeId: string) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/v0/forward/${nodeId}`);
      if (response.status === 200) {
        if (response.data.Success) {
          setVpnData(response.data);
          dialogRef.current.showModal();
        } else {
          notification.success("The node is not available. Please try again later.");
        }
      }
    } catch (error) {
      console.error(error);
      notification.error("There was an error getting the data of the node. Please try again later.");
    }
  };

  return nodesData.loading ? (
    <div>Loading...</div>
  ) : (
    <div className="overflow-x-auto grid lg:grid-cols-2 flex-grow">
      <JoinSteps ref={dialogRef} vpnData={vpnData} />
      {nodesData.data.registrations
        .filter(
          (node: any, index: any, self: any) =>
            node.nodeId && node.nodeId.length > 43 && index === self.findIndex(item => item.nodeId === node.nodeId),
        )
        .map((node: any, index: number) => (
          <div className="card bg-base-100 shadow-md m-2" key={index}>
            <div className="card-body">
              <div className="flex justify-between">
                <div className="flex align-center">
                  <img
                    className="w-12 h-12 mr-4"
                    src={
                      "https://api.dicebear.com/7.x/identicon/svg?size=4&radius=20&backgroundColor=b6e3f4&seed=" +
                      node.nodeId
                    }
                    alt="Peer icon"
                  />
                  <div>
                    <h3 style={{ wordBreak: "break-word", marginRight: 5 }} className="text-gray-900 leading-none">
                      Peer <code className="text-[#0975f6]">{node.nodeId}</code>
                    </h3>
                    <div>
                      {nodesStatus[index] ? (
                        <div className="badge badge-primary">Enabled</div>
                      ) : (
                        <div className="badge badge-neutral">Disabled</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-right">
                  <Button onClick={() => join(node.nodeId)} disabled={!nodesStatus[index]}>
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
