import { ChartPieIcon } from "@heroicons/react/24/outline";

export const ContractInteraction = ({ nodeId }) => {
  return (
    <div className="flex bg-base-300 relative pb-10">
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <h2 className="text-5xl sm:text-5xl text-black flex mb-5">
            <ChartPieIcon className="h-11 w-11 mr-3" />
            My node dashboard
          </h2>
          <span className="text-1xl text-grey">
            <strong>Peer ID</strong>: <code>{nodeId}</code>
          </span>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
