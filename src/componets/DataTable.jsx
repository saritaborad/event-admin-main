import DataTables from "datatables.net-dt";
import "datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons";
import "datatables.net-buttons-bs4";
import { useEffect, useRef } from "react";

function ReactDataTable({ ...props }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const dt = new DataTables(tableRef.current, {
      ...props,
      scrollX: true,
      autoWidth: false,
      columnDefs: [
        {
          targets: ["_all"],
          className: "mdc-data-table__cell",
        },
      ],
      buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5", "print"], // Use the HTML5 buttons
      // dom: "Bfrtip",
    });
    return () => {
      dt.destroy();
    };
  }, []);

  return (
    <div className="main mb-24 mt-4">
      <table ref={tableRef} className="transactionTable"></table>
    </div>
  );
}

export default ReactDataTable;
