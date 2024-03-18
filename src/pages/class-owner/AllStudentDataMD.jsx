import React, { useEffect, useState , useMemo} from "react";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";
import defaultImage from "../../assets/blank_user.svg"


// ==========================

import { MaterialReactTable } from 'material-react-table';
import { Box, Typography , Button} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';


// ==============================
import Loader from "../../componets/ui-elements/Loader";
import ImageModel from "../../componets/ui-elements/ImageModel";

const AllStudentDataMD = () => {

  const [studentData, setStudentData] = useState([]);

  const getGarbaData = async (classId) => {
    console.log(classId);
    const response = await makeApiCall(
      "get",
      `garbaclass/info/${classId}`,
      null,
      "raw"
    );
    if (response.data.status === 1) {
      console.log(response.data);
      const branchList = response.data.data.branch_list;
      const approvalRequest = branchList.reduce((students, branch) => {
        console.log(branch);
        const branchStudents = branch.approval_request_list.map((student) => ({
          branch_id: branch._id,
          branch_name: branch.branch_name,
          status: "Pending",
          ...student,
        }));

        return [...students, ...branchStudents];
      }, []);

      const studentList = branchList.reduce((students, branch) => {
        console.log(branch);
        const branchStudents = branch.student_list.map((student) => ({
          branch_id: branch._id,
          branch_name: branch.branch_name,
          status: student.pass_list.pass_status,
          ...student,
        }));

        return [...students, ...branchStudents];
      }, []);

      const combinedArray = approvalRequest.concat(studentList);

      const allStundets = combinedArray.map((student) => ({
        id:
          student.status === "Approved" || "Active"
            ? student.pass_list.pass_random_id
              ? student.pass_list.pass_random_id
              : "NULL"
            : "NULL",
        name: student.name,
        garba_class: student.branch_name,
        gender: student.gender,
        pass_status: student.status,
        phone_no: student.phone_number,
        avatar: student.profile_pic,
      }));

      setStudentData(allStundets);
    }
    return response;
  };

  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/info/",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        getGarbaData(response.data.data.owener_of_garba_class._id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { data, isLoading, error, } = useQuery("data", fetchData);


  useEffect(() => {
    if (!isLoading && data) {
      getGarbaData(data.data.data?.owener_of_garba_class._id);
    }
  }, [data, isLoading, studentData, setStudentData]);



  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        id: 'employee', //id used to define `group` column
        header: 'Employee',
        columns: [
          {
            accessorFn: (row) => `${row.name}`, //accessorFn used to join multiple data into a single cell
            id: 'profile_pic', //id is still required when using accessorFn instead of accessorKey
            header: 'Profile pic',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: '50%',width:"30px" }}
                />
                {/* <p>{row.original.roles}</p> */}
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
        ],
      },
      {
        accessorKey: 'garba_class',
        header: 'Garba class name',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'phone_no',
        header: 'Phone no',
            
      },
      {
        accessorKey: 'pass_status',
        header: 'Status',
      },
    ],
    [],
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);
   
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  return(<>
      {isLoading ? <Loader /> : null}
      <>
      {studentData?.length > 0 ? (
             <MaterialReactTable
      columns={columns}
      data={studentData}
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderDetailPanel={({ row }) => (
        <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          <Typography>Base Price: {row.original.base_price}</Typography>
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
        >
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Page Rows
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Selected Rows
          </Button>
        </Box>
      )}
    />
    ) : null}
    </>
    <div className="h-14"></div>
  </>);
};

export default AllStudentDataMD;
