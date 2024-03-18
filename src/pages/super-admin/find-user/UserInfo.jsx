import React, { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { useNavigate, useParams } from "react-router-dom";
import blank_user from "../../../assets/blank_user.svg";
import raas from "../../../assets/raas.svg";
import parking from "../../../assets/parking.svg";
import creadit_card from "../../../assets/credit-card.svg";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import last_login from "../../../assets/last-login.svg";
import support from "../../../assets/support.svg";


const UserInfo = () => {
  const params = useParams();
  const [user, setUser] = useState();
  const [userRole, setUserRole] = useState();
  const [imageModel, setImageModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const findUser = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "user/userdetails",
        {
          phone_number: params.id,
        },
        "raw"
      );
      if (response.data.status === 1) {
        setUser(response.data.data);
        setUserRole(response.data.data.roles);
        setIsLoading(false);
      } else if (response.data.status === 10) {
        console.log(response);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const n_user = [
    {
      id: 1,
      image: raas,
      title: "Garba tickets",
      path: "/role/superadmin/finduser/tickets/",
    },
    {
      id: 2,
      image: parking,
      title: "Parking tickets",
      path: "/role/superadmin/finduser/parkings/",
    },
    {
      id: 3,
      image: creadit_card,
      title: "Transection",
      path: "/role/superadmin/finduser/transection/",
    },
    {
      id: 4,
      image: last_login,
      title: "Last Login",
      path: "/role/superadmin/finduser/last-login/",
    },
  ];
  const p_user = [
    {
      id: 1,
      image: creadit_card,
      title: "Transection",
      path: "/role/superadmin/finduser/transection/",
    },
    {
      id: 2,
      image: last_login,
      title: "Last Login",
      path: "/role/superadmin/finduser/last-login/",
    },
    {
      id: 3,
      image: parking,
      title: "User pass",
      path: "/role/superadmin/finduser/user-pass/",
    },
    // {
    //   id: 4,
    //   image: support,
    //   title: "Mentorship program",
    //   path: "/role/superadmin/finduser/mentorship/",
    // },
  ];

  useEffect(() => {
    findUser();
  }, []);

  function handleNavigate(path) {
    navigate(path);
  }

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className=" items-start justify-center gap-4 text-white w-full">
          {/*  */}
          {
            isLoading?
            <div className="w-full h-[80px] bg-gray-200 animate-pulse rounded-md"></div>:
            <div
            className="flex items-center justify-start gap-4 w-full h-auto min-h-32 p-2 rounded-xl bg-white"
            style={{ boxShadow: "0px 0px 20px #0000002b" }}
            onClick={() =>
              navigate(`/role/superadmin/finduser/${user?.phone_number}`)
            }
          >
            <div className="bg-white rounded-2xl overflow-hidden object-cover">
              <img
                src={user?.profile_pic ? user?.profile_pic : blank_user}
                className="w-20 h-16"
                onClick={() => setImageModel(true)}
              />
            </div>
            <div className="flex items-center w-full">
              <div className="flex flex-col">
                <p className="text-black text-xl capitalize">{user?.name}</p>
                <p className="text-sm text-gray-400 my-1">
                  {user?.phone_number}
                </p>
              </div>
              <p className="ms-auto bg-primary text-white p-1 px-4 rounded-full capitalize text-sm">
                {userRole}
              </p>
            </div>
          </div>
          }

          <div className="w-full mt-5 grid grid-cols-2 mb-24 md:grid-cols-3 gap-2">
            {isLoading ? (
              <>
                <div className="w-full h-auto min-h-[160px] bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-full h-auto min-h-[160px] bg-gray-200 animate-pulse rounded-md"></div>
              </>
            ) : user?.roles === "p-user" ? (
              p_user.map((el) => {
                return (
                  <div
                    className="bg-white p-4 rounded-2xl h-40 w-auto cursor-pointer"
                    style={{ boxShadow: "0px 0px 20px #0000002b" }}
                    onClick={() =>
                      handleNavigate(`${el.path}${user.phone_number}`)
                    }
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      <img src={el.image} alt="image" />
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg text-black font-semibold">
                        {el.title}
                      </h1>
                    </div>
                  </div>
                );
              })
            ) : (
              n_user.map((el) => {
                return (
                  <div
                    className="bg-white p-4 rounded-2xl h-40 w-auto cursor-pointer"
                    style={{ boxShadow: "0px 0px 20px #0000002b" }}
                    onClick={() =>
                      handleNavigate(`${el.path}${user.phone_number}`)
                    }
                    key={el._id}
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      <img src={el.image} alt="image" />
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg text-black font-semibold">
                        {el.title}
                      </h1>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {imageModel ? (
        <ImageModel
          src={user.profile_pic}
          handleClose={() => setImageModel(false)}
        />
      ) : null}
    </>
  );
};

export default UserInfo;
