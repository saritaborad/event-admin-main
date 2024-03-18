import person from "../assets/person.svg";
import person_circle from "../assets/person-circle.svg";
import pin from "../assets/pin.svg";
import geo from "../assets/geo.svg";
import door from "../assets/door.svg";
import parking from "../assets/parking.svg";
import raas from "../assets/raas.svg";
import megaphone from "../assets/megaphone.svg";
import check from "../assets/check.svg";
import anchor from "../assets/anchor.svg";
import server from "../assets/server.svg";
import ticket from "../assets/Ticket.svg";
import ui_radios from "../assets/ui-radios.svg";
import upc_scan from "../assets/upc-scan.svg";
import person_lines from "../assets/person-lines.svg";
import chat_text from "../assets/chat-text.svg";
import creadit_card from "../assets/credit-card.svg";
import trophy from "../assets/trophy.svg";
import notification from "../assets/notification.svg";
import Tag_Dashboard from "../assets/tag-dashboard.svg";
import complimantorycode from "../assets/coupon-code.svg";
import couch from "../assets/sofa.svg";
import Physical_QR from "../assets/physical-qr.svg";
import {
  BsDoorClosedFill,
  BsFillBellFill,
  BsFillCreditCardFill,
  BsFillGeoAltFill,
  BsFillMegaphoneFill,
  BsFillPersonFill,
  BsFillPinFill,
  BsFillTagFill,
  BsFillTicketPerforatedFill,
  BsGeoFill,
  BsPersonCircle,
  BsQrCode,
  BsQrCodeScan,
  BsShieldFillCheck,
  BsNewspaper,
  BsCodeSlash,
} from "react-icons/bs";
import { FaDatabase, FaParking, FaServer, FaUsers } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { MdDiscount, MdEmojiEvents, MdOutlineVibration } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

export const dashBordData = [
  // {
  //   id: 1,
  //   image: person,
  //   title: "Agency",
  //   path: "/agency",
  //   UID: "agency",
  // },
  // {
  //   id: 2,
  //   image: person_circle,
  //   title: "Admin",
  // },
  {
    id: 3,
    image: BsFillPinFill,
    title: "Checkpoint",
    path: "/checkpoint",
    UID: "checkpoint",
  },
  {
    id: 4,
    image: BsGeoFill,
    title: "Zone",
    path: "/zonedashboard",
    UID: "zone",
  },
  {
    id: 5,
    image: BsDoorClosedFill,
    title: "Gate",
    path: "/gate",
    UID: "gate",
  },
  {
    id: 6,
    image: FaParking,
    title: "Parking",
    path: "/parkingdashboard",
    UID: "parking",
  },
  {
    id: 7,
    image: MdEmojiEvents,
    title: "Garba Class",
    path: "/garba-class",
    UID: "garba_class",
  },
  {
    id: 8,
    image: BsFillCreditCardFill,
    title: "Transaction Monitoring",
    path: "/transaction",
    UID: "transaction_monitoring",
  },
  {
    id: 9,
    image: BsQrCodeScan,
    title: "Scanning Monitoring",
    path: "/scanmoniotoring",
    UID: "scanning_monitoring",
  },
  {
    id: 10,
    image: BsFillTicketPerforatedFill,
    title: "Ticket Category",
    path: "/ticket",
    UID: "ticket_category",
  },
  {
    id: 11,
    image: BsFillMegaphoneFill,
    title: "Sponsor",
    path: "/sponsordashboard",
    UID: "sponsor",
  },
  {
    id: 12,
    image: FaDatabase,
    title: "Event",
    path: "/event",
    UID: "event",
  },
  {
    id: 13,
    image: BsShieldFillCheck,
    title: "Security",
    path: "/securitydashboard",
    UID: "security",
  },
  {
    id: 19,
    image: BsFillBellFill,
    title: "Notification",
    path: "/notification",
    UID: "notification",
  },
  {
    id: 14,
    image: BsFillTagFill,
    title: "Promo Code",
    path: "/promocode",
    UID: "promo_code",
  },
  {
    id: 15,
    image: BsFillTicketPerforatedFill,
    title: "Complimantory Code",
    path: "/complimantorycode",
    UID: "complimantory_code",
  },
  {
    id: 16,
    image: BsFillPersonFill,
    title: "Find user",
    path: "/finduser",
    UID: "find_user",
  },
  {
    id: 17,
    image: GiSofa,
    title: "Privilege Couch",
    path: "/couch",
    UID: "privilege_couch_member",
  },
  {
    id: 18,
    image: BsPersonCircle,
    title: "Admin",
    path: "/admin",
    UID: "create_admin",
  },
  {
    id: 19,
    image: BsPersonCircle,
    title: "Judge",
    path: "/judgedashboard",
    UID: "judge",
  },
  {
    id: 20,
    image: BsQrCode,
    title: "Physical QR",
    path: "/physicalqr",
    UID: "physicalqr",
  },
  {
    id: 21,
    image: RiTeamFill,
    title: "Sales Team",
    path: "/salesteam",
    UID: "salesteam",
  },
  {
    id: 22,
    image: FaServer,
    title: "Server Log",
    path: "/serverlog",
    UID: "serverlog",
  },
  {
    id: 23,
    image: FaUsers,
    title: "All pass user",
    path: "/all-pass-user",
    UID: "allpassuser",
  },
  {
    id: 24,
    image: FaUsers,
    title: "All privilege user",
    path: "/all-privilege-user",
    UID: "allprivilegeuser",
  },
  {
    id: 25,
    image: FaUsers,
    title: "All User",
    path: "/all-user",
    UID: "alluser",
  },
  {
    id: 26,
    image: BsNewspaper,
    title: "Media Press",
    path: "/mediapress",
    UID: "mediapress",
  },
  {
    id: 27,
    image: BsCodeSlash,
    title: "IT Team",
    path: "/itteam",
    UID: "itteam",
  },
  {
    id: 28,
    image: MdOutlineVibration,
    title: "User OTP",
    path: "/user-otp",
    UID: "user-otp",
  },
];
