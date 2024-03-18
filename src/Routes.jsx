import React from "react";
import { Route, Routes } from "react-router-dom";
//auth routes
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/Signup";
import Layout from "./Layout";
import WhatsappLogin from "./pages/auth/login/WhatsappLogin";
import EmailLogin from "./pages/auth/login/EmailLogin";

//roles routes
import SuperAdmin from "./pages/super-admin/dashbord";
import ClassOwner from "./pages/class-owner/dashbord";
import Security from "./pages/security/dashbord";

//common page routes
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import MyPass from "./pages/MyPass";
import EditProfile from "./pages/EditProfile";
import TransactionHistory from "./pages/super-admin/TransactionHistory";
import TransactionHistorySponsor from "./pages/sponsor/TransactionHistory";
import Terms_Conditions from "./pages/super-admin/Terms_Conditions";
import Privacy_Plicy from "./pages/super-admin/Privacy_Policy";

//super admin routes
import SuperAdminLayout from "./pages/super-admin/Layout";

import Gate from "./pages/super-admin/gate/Gate";
import NewGate from "./pages/super-admin/gate/NewGate";
import Info from "./pages/super-admin/gate/[id]";

import Zone from "./pages/super-admin/zone/ticketzone/Zone";
import ZoneDashboard from "./pages/super-admin/zone/ZoneDashboard";
import ZoneInfo from "./pages/super-admin/zone/ticketzone/[id]";
import NewPassZone from "./pages/super-admin/zone/passzone/NewPassZone";
import NewZone from "./pages/super-admin/zone/ticketzone/NewZone";
import PassZoneInfo from "./pages/super-admin/zone/passzone/[id]";
import PassZone from "./pages/super-admin/zone/passzone/PassZone";
import PrivilegeZone from "./pages/super-admin/zone/privilegezone/PrivilegeZone";
import PrivilegeZoneInfo from "./pages/super-admin/zone/privilegezone/[id]";
import NewPrivilegeZone from "./pages/super-admin/zone/privilegezone/NewPrivilegeZone";

import Checkpoint from "./pages/super-admin/checkpoint/Checkpoint";
import CheckpointInfo from "./pages/super-admin/checkpoint/[id]";
import NewCheckpoint from "./pages/super-admin/checkpoint/NewCheckpoint";

import Agency from "./pages/super-admin/agency/Agency";
import AgencyInfo from "./pages/super-admin/agency/[id]";
import NewAgency from "./pages/super-admin/agency/NewAgency";

import GarbaClass from "./pages/super-admin/garba-class/GarbaClass";
import GarbaInfo from "./pages/super-admin/garba-class/[id]";
import NewGarba from "./pages/super-admin/garba-class/NewGarba";
import GarbaDetail from "./pages/super-admin/garba-class/GarbaDetail";
import GarbaStudentList from "./pages/super-admin/garba-class/GarbaStudentList";
import GarbaStudentDetails from "./pages/super-admin/garba-class/GarbaStudentDetails";

import Ticket from "./pages/super-admin/ticket/Ticket";
import NewTicket from "./pages/super-admin/ticket/NewTicket";
import TicketInfo from "./pages/super-admin/ticket/[id]";

import Event from "./pages/super-admin/event/Event";
import EventInfo from "./pages/super-admin/event/[id]";
import NewEvent from "./pages/super-admin/event/NewEvent";

import NotificationInfo from "./pages/super-admin/notification/[id]";
import NewNotification from "./pages/super-admin/notification/NewNotification";
import Notification from "./pages/super-admin/notification/Notification";

import Sponsor from "./pages/super-admin/sponsor/Sponsor";
import NewSponsor from "./pages/super-admin/sponsor/NewSponsor";
import SponsorInfo from "./pages/super-admin/sponsor/[id]";

import ParkingDashboard from "./pages/super-admin/parking/ParkingDashboard";
import PassParking from "./pages/super-admin/parking/pass-parking/PassParking";
import PassNewParking from "./pages/super-admin/parking/pass-parking/PassNewParking";
import PassParkingInfo from "./pages/super-admin/parking/pass-parking/[id]";
import TicketParking from "./pages/super-admin/parking/ticket-parking/TicketParking";
import TicketNewParking from "./pages/super-admin/parking/ticket-parking/TicketNewParking";
import TicketParkingInfo from "./pages/super-admin/parking/ticket-parking/[id]";

import FindUser from "./pages/super-admin/find-user/FindUser";
import UserTickets from "./pages/super-admin/find-user/UserTickets";
import UserPass from "./pages/super-admin/find-user/UserPass";
import UserParkings from "./pages/super-admin/find-user/UserParkings";
import UserInfo from "./pages/super-admin/find-user/UserInfo";

import SendNotification from "./pages/super-admin/notification/SendNotification";

import Complimantorycode from "./pages/super-admin/complimantorycode/complimantorycode";
import ComplimantorycodeInfo from "./pages/super-admin/complimantorycode/[id]";
import NewComplimantorycode from "./pages/super-admin/complimantorycode/NewComplimantorycode";

import Transaction from "./pages/super-admin/transaction/Transaction";

import PromoCode from "./pages/super-admin/promo-code/PromoCode";
import NewPromoCode from "./pages/super-admin/promo-code/NewPromoCode";
import PromoCodeInfo from "./pages/super-admin/promo-code/[id]";

// import DeleteAccount from "./pages/super-admin/DeleteAccount";

import Couch from "./pages/super-admin/Couch-Member/Couch";
import NewCouch from "./pages/super-admin/Couch-Member/NewCouch";
import CouchInfo from "./pages/super-admin/Couch-Member/[id]";
import SofaDetails from "./pages/super-admin/Couch-Member/SofaDetails";
import SeatDetails from "./pages/super-admin/Couch-Member/SeatDetails";
import SofaTicket from "./pages/super-admin/Couch-Member/SofaTicket";

import SecurityDashboard from "./pages/super-admin/security/SecurityDashboard";
import SecurityInfo from "./pages/super-admin/security/securityMember/[id]";
import SecurityManagment from "./pages/super-admin/security/securityManagement/SecurityManagment";

import SecurityMember from "./pages/super-admin/security/securityMember/SecurityMember";
import NewSecurityMember from "./pages/super-admin/security/securityMember/NewSecurityMember";
import SecurityType from "./pages/super-admin/security/securityManagement/SecurityType";
import AssignSecurity from "./pages/super-admin/security/securityManagement/AssignSecurity";
import NewSecurityAssign from "./pages/super-admin/security/securityManagement/NewSecurityAssign";

import ImportCSV from "./pages/super-admin/garba-class/ImportCSV";

import Admin from "./pages/super-admin/create-admin/Admin";
import NewCreateAdmin from "./pages/super-admin/create-admin/NewCreateAdmin";
import AdminInfo from "./pages/super-admin/create-admin/[id]";

import ClassOwnerLayout from "./pages/class-owner/Layout";
import StudentList from "./pages/class-owner/StudentList";
import StudentDetails from "./pages/class-owner/StudentDetails";
import AllStudentDataMD from "./pages/class-owner/AllStudentDataMD";

import JudgeDashbord from "./pages/judge/dashbord";

import SponsorDashbord from "./pages/sponsor/dashbord";

import SponsorLayout from "./pages/sponsor/Layout";
import IssueComplimentary from "./pages/sponsor/complimentary-code/IssueComplimentary";
import ComplimentaryCodeSponsor from "./pages/sponsor/complimentary-code/ComplimentaryCode";

import SecurityLayout from "./pages/security/Layout";
import QR_Scan from "./pages/security/QR_Scan";
import QR_ScanDev from "./pages/security/QR_ScanDev";

import Judge from "./pages/super-admin/judge/JudgeCreate/Judge";
import NewJudge from "./pages/super-admin/judge/JudgeCreate/NewJudge";
import JudgeDashboard from "./pages/super-admin/judge/JudgeDashboard";

import PriceCategory from "./pages/super-admin/judge/PriceCategory/PriceCategory";
import NewPriceCategory from "./pages/super-admin/judge/PriceCategory/NewPriceCategory";
import PriceCategoryInfo from "./pages/super-admin/judge/PriceCategory/[id]";
import UserTransections from "./pages/super-admin/find-user/UserTransections";
import AdminDashbord from "./pages/admin/dashbord";
import Last_Login from "./pages/super-admin/find-user/LastLogin";
import SponsorDashboard from "./pages/super-admin/sponsor/SponsorDashboard";
import PublicLayout from "./PublicLayout";

import JudgeManagement from "./pages/super-admin/judge/JudgeManagement/JudgeManagement";
import JudgeAssign from "./pages/super-admin/judge/JudgeManagement/JudgeAssign";
import AllJudge from "./pages/super-admin/judge/JudgeManagement/AllJudge";

import PriceManagement from "./pages/super-admin/judge/PriceManagement/PriceManagement";
import AllPrice from "./pages/super-admin/judge/PriceManagement/AllPrice";
import PriceMember from "./pages/super-admin/judge/PriceManagement/PriceMember";

import JudgeLayout from "./pages/judge/Layout";
import ScanLogs from "./pages/super-admin/scan-monitor/ScanLogs";
import SearchStudent from "./pages/judge/SearchStudent";
import Categories from "./pages/judge/Categories";
import Mentorship from "./pages/super-admin/find-user/mentorship/Mentorship";
import NewStudent from "./pages/super-admin/find-user/mentorship/NewStudent";
import EditResult from "./pages/judge/EditResult";

import PhysicalQR from "./pages/super-admin/physicalQR/PhysicalQR";
import QRScaner from "./pages/super-admin/physicalQR/QRScaner";
import SponsorTransection from "./pages/super-admin/sponsor/Transection";

import SalesTeam from "./pages/super-admin/salesTeam/SalesTeam";
import NewSalesTeam from "./pages/super-admin/salesTeam/NewSalesTeam";

import SalesLayout from "./pages/salesteam/Layout";
import SalesDashboard from "./pages/salesteam/SalesDashboard";
import TransferTicket from "./pages/salesteam/TransferTicket";
import SecurityMemberDev from "./pages/super-admin/security/securityMember/SecurityMemberDev";

import ServerLog from "./pages/super-admin/server-log/ServerLog";
import AllPassUsers from "./pages/super-admin/all-pass/AllPassUsers";
import AllPrivilegeUsers from "./pages/super-admin/all-privilege/AllPrivilegeUsers";
import AllUsers from "./pages/super-admin/all-user/AllUsers";
import Mediapress from "./pages/super-admin/mediapress/Mediapress";
import { io } from "socket.io-client";
import LiveServer from "./pages/super-admin/server-log/live-server/LiveServer";
import LiveScanning from "./pages/super-admin/scan-monitor/live-scanning/LiveScanning";
import { BASE_URL } from "./api/Post";
import OpixoDashbord from "./pages/opixo/Dashbord";
import OpixoGallery from "./pages/opixo/OpixoGallery";
import UserImages from "./pages/opixo/UserImages";

import IT_Team from "./pages/super-admin/IT_Team/IT_Team";
import ActiveGroundStaff from "./pages/super-admin/physicalQR/ActiveGroundStaff";
import UserOTP from "./pages/super-admin/user-otp/UserOTP";
import UserLogs from "./pages/super-admin/scan-monitor/UserLogs";

// export const socket = io("https://production.mydigievent.co.in")
// export const socket = io("https://test.mydigievent.co.in");
export const socket = io(BASE_URL.replace("/v1/api", ""));

const Routing = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<PublicLayout />}>
        <Route index path="/login" element={<Login />} />
        <Route path="/login/:id" element={<WhatsappLogin />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/opixo" element={<OpixoDashbord />} />
        <Route path="/opixo/gallery/:day" element={<OpixoGallery />} />
        <Route path="/opixo/user-images/:albumid" element={<UserImages />} />
      </Route>
      {/* Role routes */}
      <Route element={<Layout />}>
        <Route path="/role/superadmin/" element={<SuperAdmin />} />
        <Route path="/role/classowner/" element={<ClassOwner />} />
        <Route path="/role/security" element={<Security />} />
        <Route path="/role/admin" element={<AdminDashbord />} />
        <Route path="/role/sponsor" element={<SponsorDashbord />} />
        <Route path="/role/judge" element={<JudgeDashbord />} />
        <Route path="/role/salesteam" element={<SalesDashboard />} />

        {/* Judge routes */}
        <Route element={<JudgeLayout />}>
          <Route path="/role/judge/pass" element={<MyPass />} />
          <Route
            path="/role/judge/notification-page"
            element={<Notifications />}
          />
          <Route path="/role/judge/profile" element={<Profile />} />

          <Route path="/role/judge/searchstudent" element={<SearchStudent />} />
          <Route path="/role/judge/categories" element={<Categories />} />
          <Route path="/role/judge/editresult" element={<EditResult />} />
        </Route>

        {/* Super-Admin routes */}
        <Route element={<SuperAdminLayout />}>
          {/* IT_Team routes */}
          <Route path="/role/superadmin/itteam" element={<IT_Team />} />
          <Route path="/role/superadmin/user-otp" element={<UserOTP />} />

          {/* Server-Log routes */}
          <Route path="/role/superadmin/serverlog" element={<ServerLog />} />
          <Route
            path="/role/superadmin/serverlog/liveserver"
            element={<LiveServer />}
          />

          <Route
            path="/role/superadmin/scanmoniotoring"
            element={<ScanLogs />}
          />
          <Route
            path="/role/superadmin/scanmoniotoring/livescaning"
            element={<LiveScanning />}
          />
          <Route
            path="/role/superadmin/scanmoniotoring/userlogs"
            element={<UserLogs />}
            />
            <Route
            path="/role/admin/notification-page"
            element={<Notifications />}
          />
          <Route path="/role/admin/profile" element={<Profile />} />
          <Route path="/role/admin/pass" element={<MyPass />} />
          <Route path="/role/admin/edit-profile" element={<EditProfile />} />
          <Route
            element={<TransactionHistory />}
            path="/role/superadmin/transaction-history"
          />
          <Route
            element={<Terms_Conditions />}
            path="/role/superadmin/terms-conditions"
          />
          <Route
            element={<Privacy_Plicy />}
            path="/role/superadmin/privacy-plicy"
          />
          {/* <Route
            path="/role/superadmin/delete-account"
            element={<DeleteAccount />}
          /> */}
          <Route
            path="/role/superadmin/notification-page"
            element={<Notifications />}
          />
          <Route path="/role/superadmin/profile" element={<Profile />} />
          <Route
            path="/role/superadmin/edit-profile"
            element={<EditProfile />}
          />
          <Route path="/role/superadmin/pass" element={<MyPass />} />

          {/* Physical QR */}
          <Route path="/role/superadmin/physicalqr" element={<PhysicalQR />} />
          <Route path="/role/superadmin/physicalqr/active-staff/:id" element={<ActiveGroundStaff />} />
         

          {/* Sales Team */}
          <Route path="/role/superadmin/salesteam" element={<SalesTeam />} />
          <Route
            path="/role/superadmin/salesteam/add-new"
            element={<NewSalesTeam />}
          />

          {/* PriceCategory */}
          <Route
            path="/role/superadmin/judgedashboard/price-category"
            element={<PriceCategory />}
          />
          <Route
            path="/role/superadmin/judgedashboard/price-category/add-new"
            element={<NewPriceCategory />}
          />
          <Route
            path="/role/superadmin/judgedashboard/price-category/:id"
            element={<PriceCategoryInfo />}
          />

          <Route
            path="/role/superadmin/judgedashboard/pricemanagement"
            element={<PriceManagement />}
          />
          <Route
            path="/role/superadmin/judgedashboard/pricemanagement/allprice"
            element={<AllPrice />}
          />
          <Route
            path="/role/superadmin/judgedashboard/pricemanagement/allprice/pricemember"
            element={<PriceMember />}
          />

          {/* Judge */}
          <Route
            path="/role/superadmin/judgedashboard"
            element={<JudgeDashboard />}
          />
          <Route
            path="/role/superadmin/judgedashboard/judge"
            element={<Judge />}
          />
          <Route
            path="/role/superadmin/judgedashboard/judge-create/add-new"
            element={<NewJudge />}
          />
          {/* Judge Management */}
          <Route
            path="role/superadmin/judgedashboard/judgemanagement"
            element={<JudgeManagement />}
          />
          <Route
            path="role/superadmin/judgedashboard/judgemanagement/judgeassign"
            element={<JudgeAssign />}
          />
          <Route
            path="role/superadmin/judgedashboard/judgemanagement/alljudge"
            element={<AllJudge />}
          />

          {/* Create-Admin */}
          <Route path="/role/superadmin/admin" element={<Admin />} />
          <Route
            path="/role/superadmin/admin/:phone_number"
            element={<AdminInfo />}
          />
          <Route
            path="/role/superadmin/create-admin/add-new"
            element={<NewCreateAdmin />}
          />

          {/* Couch-Member */}
          <Route path="/role/superadmin/couch" element={<Couch />} />
          <Route
            path="/role/superadmin/couch/couch-info/:id"
            element={<CouchInfo />}
          />
          <Route path="/role/superadmin/couch/add-new" element={<NewCouch />} />
          <Route
            path="/role/superadmin/couch/sofadetails/:userid"
            element={<SofaDetails />}
          />
          <Route
            path="/role/superadmin/couch/sofadetails/:userid/seatdetails/:id"
            element={<SeatDetails />}
          />
          <Route
            path="/role/superadmin/couch/sofadetails/:userid/seatdetails/:id/ticket/:ticketid"
            element={<SofaTicket />}
          />

          {/* Complimantorypass routes */}
          <Route
            path="/role/superadmin/complimantorycode"
            element={<Complimantorycode />}
          />
          <Route
            path="/role/superadmin/complimantorycode/:coupon_code/:phone_no"
            element={<ComplimantorycodeInfo />}
          />
          <Route
            path="/role/superadmin/complimantorycode/add-new"
            element={<NewComplimantorycode />}
          />

          {/* PromoCode routes */}
          <Route path="/role/superadmin/promocode" element={<PromoCode />} />
          <Route
            path="/role/superadmin/promocode/:id"
            element={<PromoCodeInfo />}
          />
          <Route
            path="/role/superadmin/promocode/add-new"
            element={<NewPromoCode />}
          />

          {/* Transaction routes */}
          <Route
            path="/role/superadmin/transaction"
            element={<Transaction />}
          />

          {/* Event routes */}
          <Route path="/role/superadmin/event" element={<Event />} />
          <Route path="/role/superadmin/event/:id" element={<EventInfo />} />
          <Route path="/role/superadmin/event/add-new" element={<NewEvent />} />

          {/* Gate routes */}
          <Route path="/role/superadmin/gate" element={<Gate />} />
          <Route path="/role/superadmin/gate/:id" element={<Info />} />
          <Route path="/role/superadmin/gate/add-new" element={<NewGate />} />

          {/* Zone routes */}
          <Route
            path="/role/superadmin/zonedashboard"
            element={<ZoneDashboard />}
          />
          <Route path="/role/superadmin/zone" element={<Zone />} />
          <Route path="/role/superadmin/zone/:id" element={<ZoneInfo />} />
          <Route path="/role/superadmin/zone/add-new" element={<NewZone />} />
          {/* PassZone */}
          <Route
            path="/role/superadmin/zone/add-newpasszone"
            element={<NewPassZone />}
          />
          <Route
            path="/role/superadmin/zone/passzoneid/:id"
            element={<PassZoneInfo />}
          />
          <Route path="/role/superadmin/passzone" element={<PassZone />} />

          {/* Privilege Zone */}
          <Route
            path="/role/superadmin/privilege-zone"
            element={<PrivilegeZone />}
          />
          <Route
            path="/role/superadmin/privilege-zone/:id"
            element={<PrivilegeZoneInfo />}
          />
          <Route
            path="/role/superadmin/privilege-zone/add-new"
            element={<NewPrivilegeZone />}
          />

          {/* Parking routes */}
          <Route
            path="/role/superadmin/parkingdashboard"
            element={<ParkingDashboard />}
          />

          <Route
            path="/role/superadmin/parkingdashboard/passparking"
            element={<PassParking />}
          />
          <Route
            path="/role/superadmin/parkingdashboard/passparking/:id"
            element={<PassParkingInfo />}
          />
          <Route
            path="/role/superadmin/parkingdashboard/passparking/add-new-pass-parking"
            element={<PassNewParking />}
          />

          <Route
            path="/role/superadmin/parkingdashboard/ticketparking"
            element={<TicketParking />}
          />
          <Route
            path="/role/superadmin/parkingdashboard/ticketparking/add-new-ticket-parking"
            element={<TicketNewParking />}
          />
          <Route
            path="/role/superadmin/parkingdashboard/ticketparking/:id"
            element={<TicketParkingInfo />}
          />

          {/* Checkpoint routes */}
          <Route path="/role/superadmin/checkpoint" element={<Checkpoint />} />
          <Route
            path="/role/superadmin/checkpoint/:id"
            element={<CheckpointInfo />}
          />
          <Route
            path="/role/superadmin/checkpoint/add-new"
            element={<NewCheckpoint />}
          />

          {/* Garba routes */}
          <Route path="/role/superadmin/garba-class" element={<GarbaClass />} />
          <Route
            path="/role/superadmin/student-detail/:classID/:id/:type"
            element={<GarbaStudentDetails />}
          />
          <Route
            path="/role/superadmin/garba-class/:id"
            element={<GarbaInfo />}
          />
          <Route
            path="/role/superadmin/garba-class/detail/:id"
            element={<GarbaDetail />}
          />
          <Route
            path="/role/superadmin/garba-class/student-list/:classID/:status"
            element={<GarbaStudentList />}
          />
          <Route
            path="/role/superadmin/garba-class/add-new"
            element={<NewGarba />}
          />

          <Route
            path="/role/superadmin/garba-class/import-csv/:branchId"
            element={<ImportCSV />}
          />

          {/* Agency routes */}
          <Route path="/role/superadmin/agency" element={<Agency />} />
          <Route path="/role/superadmin/agency/:id" element={<AgencyInfo />} />
          <Route
            path="/role/superadmin/agency/add-new"
            element={<NewAgency />}
          />

          {/* Ticket routes */}
          <Route path="/role/superadmin/ticket" element={<Ticket />} />
          <Route
            path="/role/superadmin/ticket/add-new"
            element={<NewTicket />}
          />
          <Route path="/role/superadmin/ticket/:id" element={<TicketInfo />} />

          {/* Notification routes */}
          <Route
            path="/role/superadmin/notification"
            element={<Notification />}
          />
          <Route
            path="/role/superadmin/notification/add-new"
            element={<NewNotification />}
          />
          <Route
            path="/role/superadmin/notification/:id"
            element={<NotificationInfo />}
          />
          <Route
            path="/role/superadmin/notification/send/:id"
            element={<SendNotification />}
          />

          {/* Sponsor routes */}
          <Route
            path="/role/superadmin/sponsordashboard"
            element={<SponsorDashboard />}
          />
          <Route
            path="/role/superadmin/sponsordashboard/sponsor"
            element={<Sponsor />}
          />
          <Route
            path="/role/superadmin/sponsordashboard/sponsor/add-new"
            element={<NewSponsor />}
          />
          <Route
            path="/role/superadmin/sponsordashboard/sponsor/:id"
            element={<SponsorInfo />}
          />
          <Route
            path="role/superadmin/sponsordashboard/sponsor/transaction/:id"
            element={<SponsorTransection />}
          />

          {/* Find user routes */}

          <Route path="/role/superadmin/finduser" element={<FindUser />} />
          <Route path="/role/superadmin/finduser/:id" element={<UserInfo />} />
          <Route
            path="/role/superadmin/finduser/tickets/:number"
            element={<UserTickets />}
          />
          <Route
            path="/role/superadmin/finduser/parkings/:number"
            element={<UserParkings />}
          />
          <Route
            path="/role/superadmin/finduser/user-pass/:number"
            element={<UserPass />}
          />
          <Route
            path="/role/superadmin/finduser/last-login/:number"
            element={<Last_Login />}
          />
          <Route
            path="/role/superadmin/finduser/transection/:number"
            element={<UserTransections />}
          />
          <Route
            path="/role/superadmin/finduser/mentorship/:number"
            element={<Mentorship />}
          />
          <Route
            path="/role/superadmin/finduser/mentorship/add-new/:number"
            element={<NewStudent />}
          />

          {/* Security Management */}
          <Route
            path="/role/superadmin/securitydashboard"
            element={<SecurityDashboard />}
          />

          <Route
            path="/role/superadmin/securitydashboard/security-management"
            element={<SecurityManagment />}
          />

          <Route
            path="/role/superadmin/securitydashboard/security-management/security/:type"
            element={<SecurityType />}
          />

          <Route
            path="/role/superadmin/securitydashboard/security-management/security/:type"
            element={<SecurityType />}
          />

          <Route
            path="/role/superadmin/securitydashboard/security-management/security/assign/:type/:id"
            element={<AssignSecurity />}
          />

          <Route
            path="/role/superadmin/securitydashboard/security-management/security/assign/assign-new/:type/:id"
            element={<NewSecurityAssign />}
          />

          {/* <Route path="/role/superadmin/security/qrScan" element={<QRScan />} /> */}

          {/* Security Member  */}
          <Route
            path={"/role/superadmin/security-member/:id"}
            element={<SecurityInfo />}
          />
          <Route
            path={"/role/superadmin/securitydashboard/security-member"}
            element={<SecurityMember />}
          />
          <Route
            path={"/role/superadmin/security-member/add-new"}
            element={<NewSecurityMember />}
          />

          <Route
            path={"/role/superadmin/all-pass-user"}
            element={<AllPassUsers />}
          />
          <Route
            path={"/role/superadmin/all-privilege-user"}
            element={<AllPrivilegeUsers />}
          />

          <Route path={"/role/superadmin/all-user"} element={<AllUsers />} />
          <Route
            path={"/role/superadmin/mediapress"}
            element={<Mediapress />}
          />
        </Route>

        {/* Class Owner routes */}
        <Route element={<ClassOwnerLayout />}>
          {/* Garba Class Owner */}
          <Route
            path="/role/classowner/student-details/:type/:id"
            element={<StudentDetails />}
          />
          <Route
            element={<Terms_Conditions />}
            path="/role/classowner/terms-conditions"
          />
          <Route
            element={<Privacy_Plicy />}
            path="/role/classowner/privacy-plicy"
          />
          {/* <Route
            path="/role/classowner/delete-account"
            element={<DeleteAccount />}
          /> */}
          <Route
            path="/role/classowner/all-students"
            element={<AllStudentDataMD />}
          />
          <Route
            path="/role/classowner/student-type/:student_type"
            element={<StudentList />}
          />
          <Route path="/role/classowner/pass" element={<MyPass />} />
          <Route
            path="/role/classowner/notification-page"
            element={<Notifications />}
          />
          <Route path="/role/classowner/profile" element={<Profile />} />
          <Route
            path="/role/classowner/edit-profile"
            element={<EditProfile />}
          />
        </Route>

        {/* Sponsor routes */}
        <Route element={<SponsorLayout />}>
          <Route
            path="/role/sponsor/notification-page"
            element={<Notifications />}
          />
          <Route
            element={<Terms_Conditions />}
            path="/role/sponsor/terms-conditions"
          />
          <Route
            element={<Privacy_Plicy />}
            path="/role/sponsor/privacy-plicy"
          />
          {/* <Route
            path="/role/sponsor/delete-account"
            element={<DeleteAccount />}
          /> */}
          <Route
            path="/role/sponsor/transaction-history"
            element={<TransactionHistorySponsor />}
          />
          <Route path="/role/sponsor/profile" element={<Profile />} />
          <Route path="/role/sponsor/edit-profile" element={<EditProfile />} />
          <Route path="/role/sponsor/pass" element={<MyPass />} />
          <Route
            path="/role/sponsor/complimentary-code/issue-complymetery-pass"
            element={<IssueComplimentary />}
          />
          <Route
            path="/role/sponsor/complimentary-code"
            element={<ComplimentaryCodeSponsor />}
          />
        </Route>

        {/* Security guard routes */}
        <Route element={<SecurityLayout />}>
          <Route path="/role/security/pass" element={<MyPass />} />
          <Route
            path="/role/security/notification-page"
            element={<Notifications />}
          />
          <Route path="/role/security/profile" element={<Profile />} />
        </Route>
        <Route path="/role/security/qr-scan" element={<QR_ScanDev />} />
         <Route
            path="/role/superadmin/physicalqr/add-newqrscaner"
            element={<QRScaner />}
          />
      </Route>
      {/* Sales routes */}
      <Route element={<SalesLayout />}>
        <Route
          path="/role/salesteam/transferticket"
          element={<TransferTicket />}
        />
      </Route>
    </Routes>
  );
};

export default Routing;
