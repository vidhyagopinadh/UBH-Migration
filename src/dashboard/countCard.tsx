
import { FC } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslate } from "react-admin";
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import CardWithIcon from "./cardWithIcon";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

interface Props {
  value?: number;
  type?: string;
}

const CountCard: FC<Props> = ({ value, type }) => {
  const translate = useTranslate();
  let toLink = "";
  let icon = PlaylistAddCheckIcon;
  let title = "";
  if (type === "total") {
    toLink =
      "/requestPpaMraViewV2s?filter=%7B%22recordStatusId%22%3A1%7D&order=DESC&page=1&perPage=10&sort=createdat";
    icon = PlaylistAddCheckIcon;
    title = translate("pos.dashboard.request_list_total");
  } else if (type === "outstanding") {
    toLink =
      "/requestPpaMraViewV2s?filter=%7B%22recordStatusId%22%3A1%2C%22outstandingRequest%22%3Atrue%7D&order=DESC&page=1&perPage=10&sort=createdat";
    icon = HourglassFullIcon;
    title = translate(`resources.requests.outstanding`);
  } else if (type === "expired") {
    toLink =
      "/requestPpaMraViewV2s?filter=%7B%22recordStatusId%22%3A1%2C%22expired%22%3Atrue%7D&order=DESC&page=1&perPage=10&sort=createdat";
    icon = AccessTimeIcon;
    title = translate(`resources.requests.expiring`);
  }
  return (
    <></>
    // <CardWithIcon to={toLink} icon={icon} title={title} subtitle={value} />
  );
};

export default CountCard;
