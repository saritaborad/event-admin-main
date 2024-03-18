import React, { useEffect, useState } from "react";
import { makeApiCall } from "../../api/Post";
import { filterByProperty } from "../../utils/CommonFunctions";
import PrimaryButton from "./PrimaryButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Alert from "./Alert";

const AccessPopup = ({
  handleClose,
  propGates,
  propCheckpoints,
  propZones,
  specialAccessGates,
  specialAccessCheckpoint,
  specialAccessZones,
  blockAccessGates,
  blockAccessCheckpoints,
  blockAccessZones,
  type,
  accessTicketId,
  reloadFunc,
  popCloseFunc,
  usertype,
  allAccess,
}) => {

  console.log(allAccess)

  const animatedComponents = makeAnimated();

  const [speicalGates, setSpeicalGates] = useState();
  const [isSingleAccess, setIsSingleAccess] = useState(true);
  const [speicalZones, setSpeicalZones] = useState();
  const [speicalCheckPoints, setSpeicalCheckPoints] = useState();

  const [isAllAcess, setIsAllAcess] = useState(allAccess);

  const [blockGates, setBlockGates] = useState();
  const [blockZones, setBlockZones] = useState();
  const [blockCheckPoints, setBlockCheckPoints] = useState();

  const [gates, setGates] = useState(propGates);
  const [gateData, setGateData] = useState();
  const [acessGateData, setAcessGateData] = useState([]);

  const [zones, setZones] = useState(propZones);
  const [zoneData, setZoneData] = useState();
  const [acessZoneData, setAcessZoneData] = useState([]);

  const [checkPoints, setCheckPoints] = useState(propCheckpoints);
  const [checkPointData, setCheckPointData] = useState();
  const [acessCheckPointData, setAcessCheckPointData] = useState([]);

  const [isAlert, setIsAlert] = useState(false);

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const [useFor, setUseFor] = useState(); // useFor 0 is for special access and 1 is for common access, 2 is for block access

  const fetchData = async () => {
    const resGate = await makeApiCall("get", "/gate/all", null, "raw");
    const rawGates = resGate.data.gates;
    const filterdGates = filterByProperty(rawGates, "is_deleted", false);

    const transformedGate = filterdGates.map((item) => ({
      value: item._id,
      label: item.gate_name,
    }));
    setGateData(transformedGate);

    const resZone = await makeApiCall("get", "/zone/all", null, "raw");
    const rawZone = resZone.data.tickets;
    const filterdZone = filterByProperty(rawZone, "is_deleted", false);
    const notUseZones = filterdZone.filter(
      (zone) => !zones?.some((filterZone) => filterZone._id === zone._id)
    );

    const transformedZone = notUseZones.map((item) => ({
      value: item._id,
      label: item.zone_name,
    }));

    setZoneData(transformedZone);
    const resCheckpoint = await makeApiCall(
      "get",
      "/checkpoint/all",
      null,
      "raw"
    );
    const rawCheckpoint = resCheckpoint.data.data;
    const filterdCheckpoint = filterByProperty(
      rawCheckpoint,
      "is_deleted",
      false
    );
    const transformedCheckpoint = filterdCheckpoint.map((item) => ({
      value: item._id,
      label: item.checkpoint_name,
    }));

    setCheckPointData(transformedCheckpoint);

    // manipulate special access data
    const specialSelectGates = specialAccessGates?.map((gate) => ({
      label: gate.gate_name,
      value: gate._id,
    }));
    setSpeicalGates(specialSelectGates);

    const specialSelectZones = specialAccessZones?.map((zone) => ({
      label: zone.zone_name,
      value: zone._id,
    }));

    setSpeicalZones(specialSelectZones);

    const specialSelectCheckpoints = specialAccessCheckpoint?.map(
      (checkpoint) => ({
        label: checkpoint.checkpoint_name,
        value: checkpoint._id,
      })
    );

    setSpeicalCheckPoints(specialSelectCheckpoints);

    //maniplate block access data
    const blockSelectGates = blockAccessGates?.map((gate) => ({
      label: gate.gate_name,
      value: gate._id,
    }));

    setBlockGates(blockSelectGates);

    const blockSelectZone = blockAccessZones?.map((zone) => ({
      label: zone.zone_name,
      value: zone._id,
    }));

    setBlockZones(blockSelectZone);

    const blockSelectCheckpoints = blockAccessCheckpoints?.map(
      (checkpoint) => ({
        label: checkpoint.checkpoint_name,
        value: checkpoint._id,
      })
    );

    setBlockCheckPoints(blockSelectCheckpoints);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(isAllAcess)

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const gateArray = speicalGates?.map((gate) => gate.value);

      const zoneArray = speicalZones?.map((zone) => zone.value);

      const checkpointArray = speicalCheckPoints?.map(
        (checkpoint) => checkpoint.value
      );

      const data = {
        gateids: gateArray ? gateArray : isAllAcess ? [] : [],
        checkpointids: checkpointArray ? checkpointArray : isAllAcess ? [] : [],
        zoneids: zoneArray ? zoneArray : isAllAcess ? [] : [],
        ticketids: [accessTicketId],
        add: isSingleAccess ? true : false,
        allaccess: isAllAcess,
        type: usertype,
      };

      const response = await makeApiCall(
        "post",
        // `user/${type===0?"specialaccess":type===1?"accessblock":null}`,
        `user/${useFor == 0 ? "specialaccess" : "accessblock"}`,
        data,
        "raw"
      );
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = (method) => {
    if (method === 0) {
      setIsAlert(true);
      setStatus("start");
      setUseFor(0);
    } else {
      setIsAlert(true);
      setStatus("start");
      setUseFor(1);
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    setIsAlert(close);
    reloadFunc();
    setSpeicalGates();
    setSpeicalZones();
    setSpeicalCheckPoints();
    popCloseFunc();
  };
  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}
      <div className="fixed flex items-center justify-center z-[98] h-screen w-full bg-[#000000a1] backdrop-blur-sm top-0 left-0 text-white">
        <div className="xs:w-[80%] md:w-[50%] lg:w-[40%] w-auto rounded-3xl text-black mx-auto flex flex-col items-start justify-start bg-[#f2f2f2] h-auto min-h-[200px] overflow-hidden">
          <div className="flex items-center justify-center w-full p-5 bg-white">
            {type === 0 ? (
              <h3 className="text-xl font-semibold">Special access</h3>
            ) : type === 1 ? (
              <h3 className="text-xl font-semibold">Common access</h3>
            ) : (
              <h3 className="text-xl font-semibold">Block</h3>
            )}
          </div>
          {/* gates */}
          {type === 0 ? (
            <>
              <div className="w-full p-4">
                <div className="text w-full my-3">
                  <p className="text-[14px] font-semibold ms-1 mb-1">Gate</p>
                  <div className="authorizedNameInput h-full p-2 border border-gray-300 bg-white rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={gateData}
                        value={speicalGates}
                        components={animatedComponents}
                        isMulti
                        name="gate"
                        placeholder="Select gate"
                        onChange={(selectedOptions) =>
                          setSpeicalGates(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <div className="text w-full my-3">
                  <p className="text-[14px] font-semibold ms-1 mb-1">Zone</p>
                  <div className="authorizedNameInput h-full p-2 border border-gray-300 bg-white rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={zoneData}
                        value={speicalZones}
                        components={animatedComponents}
                        placeholder="Select zone"
                        isMulti
                        name="zone"
                        onChange={(selectedOptions) =>
                          setSpeicalZones(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent "
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <div className="text w-full mb-10">
                  <p className="text-[14px] font-semibold ms-1 mb-1">
                    Check Point
                  </p>
                  <div className="authorizedNameInput w-full h-full p-2 border border-gray-300 bg-white rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={checkPointData}
                        value={speicalCheckPoints}
                        components={animatedComponents}
                        placeholder="Select checkpoint"
                        isMulti
                        name="checkpoint"
                        onChange={(selectedOptions) =>
                          setSpeicalCheckPoints(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                  <hr className="w-full border-black my-4" />
                  <div className="w-full flex items-center justify-between">
                    <p>Give access to all</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value={isAllAcess}
                        onChange={() => {setIsAllAcess(!isAllAcess);setIsSingleAccess(false)}}
                        className="sr-only peer"
                        checked={isAllAcess ? true : false}
                      />
                      <div className=" w-11 h-6 bg-gray-200 rounded-full  dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <PrimaryButton
                  title={"Give special acess"}
                  background={"bg-primary"}
                  handleClick={() => handleClick(0)}
                />
                <div className="flex justify-center items-center w-full my-4">
                  <button className="text-[#00000080]" onClick={handleClose}>
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : type === 1 ? (
            <>
              <div className="p-2 w-full">
                <div className="w-full p-2 rounded-md">
                  <p className="font-semibold text-lg">Gates</p>
                  <div className="flex flex-wrap gap-2 w-full justify-items-start bg-white p-2 rounded-xl">
                    {gates ? (
                      gates?.map((gate) => {
                        return (
                          <p
                            className="bg-gray-200 py-1 px-2 rounded-lg whitespace-nowrap text-sm"
                            key={gate._id}
                          >
                            {gate.gate_name}
                          </p>
                        );
                      })
                    ) : (
                      <p>No gates found</p>
                    )}
                  </div>
                </div>

                {/* checkpoints */}
                <div className="w-full p-2 rounded-md">
                  <p className="font-semibold text-lg">Checkpoint</p>
                  <div className="flex flex-wrap gap-2 w-full justify-items-start bg-white p-2 rounded-xl">
                    {checkPoints ? (
                      checkPoints?.map((checkpoint) => {
                        return (
                          <p
                            className="bg-gray-200 py-1 px-2 rounded-lg whitespace-nowrap text-sm"
                            key={checkpoint._id}
                          >
                            {checkpoint.checkpoint_name}
                          </p>
                        );
                      })
                    ) : (
                      <p>No checkpoint found</p>
                    )}
                  </div>
                </div>

                {/* zones */}
                <div className="w-full p-2 rounded-md">
                  <p className="font-semibold text-lg">Zones</p>
                  <div className="flex flex-wrap gap-2 w-full justify-items-start bg-white p-2 rounded-xl">
                    {zones ? (
                      zones.map((zone) => {
                        return (
                          <p
                            className="bg-gray-200 py-1 px-2 rounded-lg whitespace-nowrap text-sm"
                            key={zone._id}
                          >
                            {zone.zone_name}
                          </p>
                        );
                      })
                    ) : (
                      <p>No zones found</p>
                    )}
                  </div>
                </div>
                <div className="my-4 w-full">
                  <PrimaryButton
                    title={"Close"}
                    background={"bg-red-500"}
                    handleClick={handleClose}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full p-4">
                <div className="text w-full my-3">
                  <p className="text-[14px] font-semibold ms-1 mb-1">Gate</p>
                  <div className="authorizedNameInput h-full p-2 border border-gray-300 bg-white rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={gateData}
                        value={blockGates}
                        components={animatedComponents}
                        isMulti
                        name="gate"
                        placeholder="Select gate"
                        onChange={(selectedOptions) =>
                          setBlockGates(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <div className="text w-full my-3">
                  <p className="text-[14px] font-semibold ms-1 mb-1">Zone</p>
                  <div className="authorizedNameInput h-full p-2 border border-gray-300 bg-white rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={zoneData}
                        value={blockZones}
                        components={animatedComponents}
                        placeholder="Select zone"
                        isMulti
                        name="zone"
                        onChange={(selectedOptions) =>
                          setBlockZones(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent "
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <div className="text w-full mb-10">
                  <p className="text-[14px] font-semibold ms-1 mb-1">
                    Check Point
                  </p>
                  <div className="authorizedNameInput w-full h-full p-2 border border-gray-300 bg-white rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={checkPointData}
                        value={blockCheckPoints}
                        components={animatedComponents}
                        placeholder="Select checkpoint"
                        isMulti
                        name="checkpoint"
                        onChange={(selectedOptions) =>
                          setBlockCheckPoints(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <PrimaryButton
                  title={"Block all acess of user"}
                  background={"bg-red-500"}
                  handleClick={() => handleClick(2)}
                />
                <div className="flex justify-center items-center w-full my-4">
                  <button className="text-[#00000080]" onClick={handleClose}>
                    Close
                  </button>
                </div>
              </div>
            </>
            // <div className="my-4 px-2 w-full">
            //   <PrimaryButton
            //     title={"Block all acess of user"}
            //     background={"bg-red-500"}
            //     handleClick={() => handleClick(1)}
            //   />
            //   <div className="flex justify-center items-center w-full my-4">
            //     <button className="text-[#00000080]" onClick={handleClose}>
            //       Close
            //     </button>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccessPopup;
