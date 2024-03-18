import { BsTrophy } from "react-icons/bs";
import black_user from "../../assets/blank_user.svg";
import InfoButton from "../../componets/ui-elements/InfoButton";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../api/Post";
import { useLocation } from "react-router-dom";

const EditResult = () => {
    const location = useLocation();
    const passId = location.state.passId

    const [passUser, setPassUser] = useState();

    const getSingleResult = async () => {
        try {
            const data = {
                pass_id: passId
            }
            const response = await makeApiCall(
                "post",
                "judge/passuserresult",
                data,
                "raw"
            );
            console.log(response?.data);

            setPassUser(response?.data?.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getSingleResult()
    }, []);

    return (

        <div className="securityHome h-screen px-5 pt-5">
            <div className="securityDetails bg-white p-4 rounded-2xl flex">
                <div className="securityImage rounded-full bg-sky-400 overflow-auto h-12 w-12">
                    <img
                        src={passUser?.user?.profile_pic ? passUser?.user?.profile_pic : black_user}
                        className="w-full object-cover"
                        alt="image"
                    />
                </div>
                <div className="securityData flex items-center ms-4">
                    <div className="securityName ">
                        <h1 className="text-lg font-medium">{passUser?.user?.name}</h1>
                        <p className="text-sm">{passUser?.user?.phone_number}</p>
                    </div>
                </div>
            </div>

            <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
                <InfoButton
                    icon={<BsTrophy className="text-xl" />}
                    title={passUser?.winner?.prize_category?.prize_name}
                />
                <InfoButton
                    icon={<BsTrophy className="text-xl" />}
                    title={passUser?.winner?.rank}
                />
            </div>

        </div>



    )
}

export default EditResult