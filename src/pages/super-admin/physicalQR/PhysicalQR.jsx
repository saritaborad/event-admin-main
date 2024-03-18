import { BsSearch } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import { useEffect, useState, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import { MaterialReactTable } from "material-react-table";
import Select from "react-select";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import {
  filterByProperty,
  handleNumberValidate,
} from "../../../utils/CommonFunctions";
import {
  animatedComponents,
  bloodData,
  genderData,
} from "../../../utils/commonData";

const PhysicalQR = () => {
  const tableRef = useRef();
  const [groundStaffTableData, setGroundStaffTableData] = useState([]);
  const [groundStaffData, setGroundStaffData] = useState([]);
  const [editDetailParams, setEditDetailParams] = useState({});
  const [editDetail, setEditDetail] = useState(false);
  const [qrId, setQrId] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/allgroundstaff",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const rawGroundStaff = response.data.data;
        setGroundStaffData(rawGroundStaff);

        const tableGroundStaff = rawGroundStaff.map((user) => ({
          _id: user._id,
          name: user.name ? user.name : "---",
          phone_number: user?.phone_number ? user.phone_number : "---",
          gender: user?.gender ? user.gender : "---",
          remark: user.remark ? user.remark : "---",
          gsqrcode: user.gsqrcode,
          device_type: user?.android_device
            ? "Android"
            : user?.ios_device
            ? "Apple"
            : "---",
        }));
        setGroundStaffTableData(tableGroundStaff);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      size: 50,
    },
    {
      accessorKey: "phone_number",
      header: "Phone number",
      size: 50,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 50,
    },
    {
      accessorKey: "remark",
      header: "Remark",
      size: 50,
    },
    {
      id: "edit",
      header: "Edit",
      columns: [
        {
          header: "Edit",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-rose-500 px-2 py-2 text-white rounded-sm"
              onClick={() => handleEditUser(row.original._id)}
            >
              Edit
            </button>
          ),
        },
      ],
    },
  ];

  const handleEditUser = (id) => {
    setEditDetail(true);
    setQrId(id);

    try {
      const dt = groundStaffData;
      const filterData = filterByProperty(dt, "_id", id);
      setEditDetailParams(filterData[0]);

      console.log(filterData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditDetailParams({ ...editDetailParams, [name]: value });
  };

  const handleNumberChange = async (e, type) => {
    const inputValue = e.target.value;
    const { name, value } = e.target;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 10) {
      const isExist = await handleNumberValidate(numericValue);

      if (isExist && isExist.data.status == 1) {
        if (isExist.data.data.roles === "n-user") {
          if (type === "mentor") {
            setMentorParams({ ...mentorParams, [name]: value });
          } else {
            setEditDetailParams({ ...editDetailParams, [name]: value });
          }
        } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        if (type === "mentor") {
          setMentorParams({ ...mentorParams, [name]: value });
        } else {
          setEditDetailParams({ ...editDetailParams, [name]: value });
        }
      }
    }
  };

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const userUpdate = async () => {
    setStatus("loading");
    const params = {
      name: editDetailParams.name,
      phone_number: editDetailParams.phone_number,
      gender: editDetailParams.gender,
      blood_group: editDetailParams.blood_group,
      remark: editDetailParams.remark,
      // qr_id: qrId,
      qr_id: "6515204e0cf53e8723ba57a4",
    };

    const response = await makeApiCall(
      "post",
      "user/updategroundstaff",
      params,
      "raw"
    );
    if (response.data.status === 1) {
      setStatus("complete");
      setSuccessMsg(response.data.message);
    } else {
      setStatus("error");
      setErrorMsg(response.data.message);
    }
  };

  const handleComplete =()=>{
    setIsAlert(false);
    setEditDetail(false);
    fetchData()
  }

  const handleCancel =()=>{
    setIsAlert(false);
    setEditDetail(false);
    fetchData()
  }



  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={userUpdate}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}

      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Physical QR"}
          link={"/role/superadmin/physicalqr/add-newqrscaner"}
        />

        {groundStaffTableData && (
          <div ref={tableRef} className="hidden md:block ">
            <MaterialReactTable
              style={{ margin: "20px" }}
              columns={columns}
              data={groundStaffTableData}
              positionToolbarAlertBanner="bottom"
            />
          </div>
        )}

        {editDetail === true ? (
          <div className="bg-[#00000080] h-screen w-[87%] fixed top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
              <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                <p className="font-semibold">Edit Details</p>
                <span onClick={() => setEditDetail(false)}> &times;</span>
              </div>
              <div className="userDetails flex flex-col gap-3">
                <div className="mt-3">
                  <InputField
                    type={"text"}
                    placeholder={"Name"}
                    inputPlaceholder="Name"
                    name="name"
                    value={editDetailParams["name"] || ""}
                    handleChange={handleEditUserInputChange}
                  />
                </div>
                <div>
                  <InputField
                    type={"number"}
                    placeholder={"Phone No"}
                    inputPlaceholder="Phone No"
                    name="phone_number"
                    value={editDetailParams["phone_number"] || ""}
                    handleChange={handleNumberChange}
                  />
                </div>
                <div>
                  <InputField
                    type={"text"}
                    placeholder={"Remarks"}
                    inputPlaceholder="Remarks"
                    name="remarks"
                    value={editDetailParams["remarks"] || ""}
                    handleChange={handleNumberChange}
                  />
                </div>
                <div className="text w-full">
                  <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
                  <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={genderData}
                        components={animatedComponents}
                        isMulti={false}
                        name="gender"
                        placeholder="Select Gender"
                        onChange={(e) => {
                          const { value } = e;
                          const name = "gender";
                          setEditDetailParams({
                            ...editDetailParams,
                            [name]: value,
                          });
                        }}
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>

                <div className="text w-full">
                  <p className="text-[14px] font-semibold ms-1 mb-1">
                    Blood Group
                  </p>
                  <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={bloodData}
                        components={animatedComponents}
                        isMulti={false}
                        name="blood_group"
                        placeholder="Select Blood Group"
                        onChange={(e) => {
                          const { value } = e;
                          const name = "blood_group";
                          setEditDetailParams({
                            ...editDetailParams,
                            [name]: value,
                          });
                        }}
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 selection:bg-none">
                  <PrimaryButton
                    background={"primary-button"}
                    // handleClick={createCheckPoint}
                    handleClick={handleClick}
                    title={"Submit"}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default PhysicalQR;


