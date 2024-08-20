import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);
const swedishLocale = {
  name: "sv",
  weekStart: 1,
  weekdaysMin: "Sön_Mån_Tis_Ons_Tor_Fre_Lör".split("_"),
  months:
    "Januari_Februari_Mars_April_Maj_Juni_Juli_Augusti_Septemper_Oktober_November_December".split(
      "_",
    ),
};
dayjs.locale("en", swedishLocale, true);
dayjs.locale("sv");
