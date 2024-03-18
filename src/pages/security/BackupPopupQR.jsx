//parking popup
{
  /* <div className="parking w-full ">
                 <div className="top text-center ">
                   <div className="image bg-white p-2 rounded-full absolute h-[70px] w-[70px] top-[-35px] left-0 right-0 m-auto flex place-content-center ">
                     <img src={car} alt="image" className="h-14 w-14" />
                   </div>
                   <div className="number mt-14">
                     <h3 className="text-center font-medium">GJ-05-1234</h3>
                   </div>
                   <div className="parking text-center my-3 flex items-center justify-center">
                     <p className="text-sm rounded-full ">ID : 123456</p>
                   </div>
                   <div className="parking text-center my-3 flex items-center justify-center">
                     <p className="text-[#13B841] text-sm bg-[#D8F5E0] rounded-full px-5 py-2 ">
                     Ticket User
                     </p>
                   </div>
                 </div>
                 <div className="center bg-[#F3F3F3] py-3">
                   <div className="name text-center">
                     <h3 className="text-xl my-1">Darshan Raval DAY.1</h3>
                     <div className="location flex items-center justify-center">
                       <BsGeoAltFill className="me-2 text-gray-400" />
                       <p className="text-sm text-gray-400 my-1">
                         katargam Road, SURAT
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="my-3 flex items-center justify-between mx-7">
                   <div className="par1">
                     <p className="text-gray-400 my-1 text-sm">Gate No</p>
                     <p className="text-sm">101</p>
                   </div>
                   <div className="par1">
                     <p className="text-gray-400 my-1 text-sm">Parking Name</p>
                     <p className="text-sm">Purple</p>
                   </div>
                 </div>
                 <div className="button flex items-center w-full gap-3 p-5">
                   <button className="bg-[#13B841] text-white w-full p-4 rounded-full text-sm font-medium">
                     Confirm
                   </button>
                   <button className="bg-[#FE385C] text-white w-full p-4 rounded-full text-sm font-medium">
                     Reject
                   </button>
                 </div>
        </div> */
}

//check failed popup
{
  /* <div className="parking w-full ">
                 <div className="top text-center ">
                   <div className="image bg-[#F6C6CF] p-2 border-4 border-white rounded-full absolute h-[90px] w-[90px] top-[-45px] left-0 right-0 m-auto flex place-content-center ">
                     <GoAlertFill className="h-10 w-10 text-primary m-auto" />
                   </div>
                   <div className="number mt-16">
                     <h3 className="text-center text-primary text-3xl font-medium">
                       Check In Rejected
                     </h3>
                   </div>
                   <div className="parking text-center my-5 flex items-center justify-center">
                     <p className="text-lg text-gray-400 rounded-full ">
                       Your Ticket Check-In Failed
                     </p>
                   </div>
                 </div>
                 <div className="button w-full gap-3 py-5 px-20">
                   <button className="bg-[#FE385C] text-white w-full p-4 rounded-full text-sm font-medium">
                     Close
                   </button>
                 </div>
               </div> */
}

//  Check Success popup Start
{
  /* <div className="parking w-full ">
                 <div className="top text-center ">
                   <div className="image bg-[#13B841] p-2 border-4 border-white rounded-full absolute h-[90px] w-[90px] top-[-45px] left-0 right-0 m-auto flex place-content-center ">
                     <FiCheck className="h-10 w-10 text-white m-auto" />
                   </div>
                   <div className="number mt-16">
                     <h3 className="text-center text-[#13B841] text-3xl font-medium">
                       Check In Successfull
                     </h3>
                   </div>
                   <div className="parking text-center my-5 flex items-center justify-center">
                     <p className="text-lg text-gray-400 rounded-full px-10 ">
                       Your Ticket Check-In Successfully Completed
                     </p>
                   </div>
                 </div>
                 <div className="button w-full gap-3 py-5 px-20">
                   <button className="bg-[#13B841] text-white w-full p-4 rounded-full text-sm font-medium">
                     Ok
                   </button>
                 </div>
               </div> */
}
// Check Success popup End

{
  /* <>
                <div
                  className={`w-full ${
                    result.is_confirmation === true
                      ? "bg-priamry_green"
                      : "bg-yellow-500"
                  }
                    text-white flex items-center justify-between p-4`}
                >
                  <div className="flex items-center justify-start gap-4">
                    {result.is_confirmation === true ? (
                      <BsCheckCircleFill className="text-4xl" />
                    ) : (
                      <BsExclamationCircleFill className="text-4xl" />
                    )}
                    <div className="flex flex-col items-start justify-center">
                      <p className="text-center font-semibold text-lg">
                        {result.is_confirmation === true
                          ? "Check-in successfull"
                          : result.message}
                      </p>
                      <p className="text-center text-sm capitalize">
                        {userType} user
                      </p>
                    </div>
                  </div>
                  <MdClose className="text-2xl" onClick={handleCloseModel} />
                </div>
                <div className="px-5 py-4 flex flex-col gap-10 justify-center items-start w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-start gap-4 ">
                      <div className=" h-14 w-14 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          className="object-cover"
                          onClick={() => {
                            setSelectedImage(
                              userType === "privilege"
                                ? result?.data?.ticket_user.profile_pic
                                : userType === "ticket"
                                ? result?.data?.ticket_user.profile_pic
                                : userType === "pass"
                                ? result?.data?.user.profile_pic
                                : result?.data?.user.profile_pic
                            );
                            setIsImageModel(true);
                          }}
                          src={
                            userType === "privilege"
                              ? result?.data?.ticket_user.profile_pic
                              : userType === "ticket"
                              ? result?.data?.ticket_user.profile_pic
                              : userType === "pass"
                              ? result?.data?.user.profile_pic
                              : result?.data?.user.profile_pic
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-center font-semibold text-[18px] capitalize">
                          {userType === "privilege"
                            ? result?.data?.ticket_user.name
                            : userType === "ticket"
                            ? result?.data?.ticket_user.name
                            : userType === "pass"
                            ? result?.data?.user.name
                            : result?.data?.user.name}
                        </p>
                        <p className="text-center text-sm">
                        
                        </p>
                      </div>
                    </div>
                    <p
                      style={{ backgroundColor: `#${zone_color}` }}
                      className={`
                    px-4 py-2 text-sm rounded-full text-white font-semibold capitalize`}
                    >
                      {userType}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-start gap-6 ">
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-center font-semibold text-[17px]">
                          {userType === "privilege"
                            ? result?.data?.event?.event_name
                            : userType === "ticket"
                            ? result?.data?.event?.event_name
                            : userType === "pass"
                            ? result?.data?.season_name
                            : result?.data?.event?.event_name}
                        </p>
                        <p className="text-center flex text-sm items-center justify-start gap-1 text-gray-400">
                          {result?.data?.event ? <FaLocationDot /> : null}
                          {result?.data?.event?.event_location}
                        </p>
                      </div>
                    </div>
                    <p
                      style={{ backgroundColor: `#${zone_color}` }}
                      className=" px-4 py-2 text-sm rounded-full text-white font-semibold"
                    >
                      {result?.data?.zone?.zone_name}
                    </p>
                  </div>
                  {result.is_confirmation === true ? (
                    <div className="flex items-center justify-between gap-2 w-full">
                      <button
                        className={` bg-priamry_green
                  } w-full py-4 rounded-full text-white font-semibold`}
                        onClick={() => handleConfirm(true)}
                      >
                        Confirm
                      </button>
                      <button
                        className={`bg-red-500
                  } w-full py-4 rounded-full text-white font-semibold`}
                        onClick={() => handleConfirm(false)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      className={` bg-black
                  } w-full py-4 rounded-full text-white font-semibold`}
                      onClick={handleCloseModel}
                    >
                      Okay
                    </button>
                  )}
                </div>
              </> */
}
