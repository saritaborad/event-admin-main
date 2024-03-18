import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { makeApiCall } from "../../../api/Post";
import { useParams } from "react-router-dom";
import {
  formatDateToDDMMMYYYY,
  formatVehicleNumber,
} from "../../../utils/CommonFunctions";
import AccessPopup from "../../../componets/ui-elements/AccessPopup";
import blank_user from "../../../assets/blank_user.svg";

const UserPass = () => {
  const [pass, setPass] = useState();
  const [isImageModel, setIsImageModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [accessPopup, setAcessPopup] = useState(false);
  const [accessGates, setAcessGates] = useState();
  const [accessZones, setAcessZones] = useState();
  const [accessCheckpoint, setAcessCheckpoint] = useState();
  const [accessTicketId, setAccessTicketId] = useState();
  const [accessType, setAccessType] = useState();

  const params = useParams();

  const accessPopupClose = () => {
    setAcessPopup(false);
  };

  const accessPopupOpen = (gate, zone, checkpoint, type, ticketId) => {
    setAcessGates(gate);
    setAcessZones(zone);
    setAcessCheckpoint(checkpoint);
    setAccessType(type);
    setAccessTicketId(ticketId);
    setAcessPopup(true);
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await makeApiCall(
        "post",
        "user/userdetails",
        {
          phone_number: params.number,
        },
        "raw"
      );
      if (res.data.status === 1) {
        setPass(res.data.data.pass_list);
        setIsLoading(false);
      } else {
        console.log(res);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const handleSpecialAccess = (gates, zones, checkpoints) => {
    accessPopupOpen(gates, zones, checkpoints, 0);
  };

  const handleCommonAccess = (gates, zones, checkpoints) => {
    accessPopupOpen(gates, zones, checkpoints, 1);
  };

  const handleBlockAccess = (gates, zones, checkpoints) => {
    accessPopupOpen(gates, zones, checkpoints, 2);
  };

  const parkingColor = pass?.parking?.color_code.slice(4);
  console.log(pass);

  return (
    <>
      <div className="ticketConfirmationPage p-4 bg-black rounded-t-3xl md:h-screen md:overflow-y-auto md:rounded-none md:m-0 flex items-start justify-center">
        <div className="ticket bg-white relative text-black pb-5 rounded-3xl mt-5 mb-20 overflow-hidden max-w-[430px]">
          {pass?.parking?.is_used ? (
            <div className="flex text-[11px] uppercase items-center justify-center absolute h-7 rotate-[320deg] w-[200px] bg-[#FE385C] backdrop-blur-md top-4 -left-16 text-white ">
              <p>Parking USED</p>
            </div>
          ) : null}
          {pass?.is_used ? (
            <div className="flex text-[11px] uppercase items-center justify-center absolute h-7 rotate-[45deg] w-[200px] bg-[#FE385C] top-5 -right-16 text-white ">
              <p>Parking USED</p>
            </div>
          ) : null}

          <div className="ticketSection pb-0">
            <div className="userImage mx-7 pt-4">
              <div className="image h-56 flex justify-center mb-3">
                <img
                  src={pass?.pass_image}
                  alt="image"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 name-address items-center">
                <div className="name">
                  <h1 className="text-xl font-bold">{pass?.season_name}</h1>
                </div>
                <div className="playerPass bg-[#13B841] ms-auto py-1 px-2 rounded-full">
                  <p className="text-white text-sm">Entry Pass</p>
                </div>
              </div>

              <div className="flex items-center justify-between name-address mt-3">
                <div className="name">
                  <h1 className="text-sm text-gray-400 font-medium">Name</h1>
                  <h1 className="text-md font-medium">{pass?.user.name}</h1>
                </div>
                <div className="zone text-right">
                  <h1 className="text-sm text-gray-400 font-medium">Zone</h1>
                  <h1
                    style={{
                      background: `#${pass?.zone.color_code.slice(4)}`,
                    }}
                    className="text-sm px-2 py-1 rounded-full text-white "
                  >
                    {pass?.zone.zone_name}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="garbaClass">
                  <h1 className="text-sm text-gray-400 font-medium">
                    Garba class name
                  </h1>
                  <h1 className="text-md font-medium">
                    {pass?.garba_class.branch_name}
                  </h1>
                </div>
                <div className="gate text-right">
                  <h1 className="text-sm text-gray-400 font-medium">
                    Gate No.
                  </h1>
                  <h1 className="text-md font-medium">
                    {pass?.zone.gates[0]?.gate_name}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="place">
                  <h1 className="text-sm text-gray-400 font-medium">Place</h1>
                  <h1 className="text-md font-medium">Sarsana Dome, Surat</h1>
                </div>
                <div className="time text-right">
                  <h1 className="text-sm text-gray-400 font-medium">Time</h1>
                  <h1 className="text-md font-medium">{pass?.pass_time}</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="place">
                  <h1 className="text-sm text-gray-400 font-medium">From</h1>
                  <h1 className="text-md font-medium">
                    {formatDateToDDMMMYYYY(pass?.from_date)}
                  </h1>
                </div>
                <div className="time text-right">
                  <h1 className="text-sm text-gray-400 font-medium">To</h1>
                  <h1 className="text-md font-medium">
                    {formatDateToDDMMMYYYY(pass?.to_date)}
                  </h1>
                </div>
              </div>
              {pass?.parking ? (
                <>
                  <div className="orContinueWith">
                    <h2 className="hr-lines">Parking</h2>
                  </div>

                  <div className="grid grid-cols-2 name-address items-center mt-3">
                    <div className="place me-auto">
                      <h1 className="text-sm text-gray-400 font-medium">
                        Parking Name
                      </h1>
                      <h1
                        className="text-md text-center font-medium text-white p-1 rounded-full"
                        style={{ backgroundColor: `#${parkingColor}` }}
                      >
                        {pass?.parking?.parking_name}
                      </h1>
                    </div>
                    <div className="time text-right">
                      <h1 className="text-sm text-gray-400 font-medium">
                        Vehical no
                      </h1>
                      <h1 className="text-md font-medium">
                        {formatVehicleNumber(pass?.parking?.vehicle_number)}
                      </h1>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 name-address items-center mt-3">
                    <div className="place">
                      <h1 className="text-sm text-gray-400 font-medium">
                        Parking Gate
                      </h1>
                      <h1 className="text-md font-medium p-1 rounded-full">
                        {pass?.parking?.gates[0].gate_name}
                      </h1>
                    </div>
                    <div className="time text-right">
                      <h1 className="text-sm text-gray-400 font-medium">
                        Allot Slot
                      </h1>
                      <h1 className="text-md font-medium">
                        {pass?.parking?.allot_slot}
                      </h1>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="left bg-black h-9 w-9 rounded-full absolute left-[-1.125rem]"></div>
          <div className="right bg-black h-9 w-9 rounded-full absolute right-[-1.125rem]"></div>
          <div className="borderTicket mt-4 border-t-2 border-dashed border-black "></div>

          <div className="ticketSection p-5">
            <div className="flex items-start justify-between gap-1 border border-black rounded-xl p-3">
              <div className="qrArea w-2/4 flex flex-col items-start justify-between gap-7">
                <div className="text text-sm">
                  <p>Scan this QR code or show ths ticket at of concert</p>
                </div>
                <p className="px-2 py-1 text-left w-auto border-2 border-gray-400 text-sm mt-2 rounded-full">
                  ID: <span className="font-bold">{pass?.pass_random_id}</span>
                </p>
                {/* <div className="ticketID rounded-full px-1 mt-3">
                </div> */}
              </div>
              <div className="qrCode flex items-center justify-center">
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 130,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    value={"userID"}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
            </div>
          </div>

          {pass?.mentor_list.length > 0 ? (
            <div className="mentorStudent py-2 px-5">
              <h1 className="font-medium mb-1">Mentor Program</h1>
              <div className=" border border-black rounded-2xl p-2 flex flex-col items-start justify-start gap-3">
                {pass?.mentor_list.map((student, i) => {
                  console.log(i, pass.mentor_list.length);
                  return (
                    <>
                      <div className="flex items-center">
                        <div className="image ">
                          <img
                            src={
                              student.profile_pic
                                ? student.profile_pic
                                : blank_user
                            }
                            alt="image"
                            className=" h-16 w-16 rounded-full object-cover"
                          />
                        </div>
                        <div className="ms-4">
                          <p className="font-medium text-sm capitalize">
                            {student.name}
                          </p>
                          <p className="text-sm">Age : -</p>
                          <p className="text-sm capitalize">
                            Gender : {student.gender}
                          </p>
                        </div>
                      </div>
                      {i + 1 === pass.mentor_list.length ? null : (
                        <hr className="w-full" />
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="h-14"></div>

      {accessPopup ? (
        <AccessPopup
          type={accessType}
          handleClose={accessPopupClose}
          propGates={accessGates}
          propCheckpoints={accessCheckpoint}
          propZones={accessZones}
          accessTicketId={accessTicketId}
        />
      ) : null}
    </>
  );
};

export default UserPass;
