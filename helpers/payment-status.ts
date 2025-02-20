import { ClockCustom, SuccessRounded, Warning } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { paymentStatus } from "@/utils/enum/payment.enum";

export const payment: Record<paymentStatus, string> = {
  CANCELLED: 'Cancelled',
  DONE: "Done",
  PENDING: "Pending",
};

export const paymentColor: Record<paymentStatus, string> = {
  CANCELLED: Colors.ERROR,
  DONE: Colors.PRIMARY,
  PENDING: Colors.LIGHT_YELLOW,
};

export const paymentTextColor: Record<paymentStatus, string> = {
  CANCELLED: Colors.LIGHT_RED,
  DONE: Colors.DARK_GREEN,
  PENDING: Colors.YELLOW,
};

export const paymentIcon: Record<paymentStatus, React.FC> = {
  CANCELLED: Warning,
  DONE: SuccessRounded,
  PENDING: ClockCustom,
};