import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { usePermissions } from 'react-admin';
import { CO_ROLE_MRA, CO_ROLE_PATIENT, CO_ROLE_PPA } from '../../../lib/universal/utils/roles';

const useRequestList = () => {
    const PREFIX = 'RequestList';
    const [mode, setMode] = useState("grid");
    const {permissions} = usePermissions()
    const classes = {
        root: `${PREFIX}-root`,
        listStyle: `${PREFIX}-listStyle`,
        addIcon: `${PREFIX}-addIcon`,
        createButton: `${PREFIX}-createButton`,
        tab: `${PREFIX}-tab`,
        icon: `${PREFIX}-icon`,
        headerVal: `${PREFIX}-headerVal`,
        header: `${PREFIX}-header`,
        title: `${PREFIX}-title`,
        actions: `${PREFIX}-actions`,
        sortButton: `${PREFIX}-sortButton`,
        paginate: `${PREFIX}-paginate`,
      }
      
    const StyledDiv = styled('div')(({ theme }) => ({
        [`&.${classes.root}`]: {
        },
        [`& .${classes.listStyle}`]: {
          backgroundColor: "unset !important",
        },
        [`& .${classes.addIcon}`]: {
          marginRight: theme.spacing(1),
        },
        [`&.${classes.createButton}`]: {
          "&:hover": {
            backgroundColor: "#ffffff",
          },
          float: "right",
          marginTop: "15px",
        },
        [`& .${classes.tab}`]: {
          display: "flex",
          alignItems: "center",
        },
        [`& .${classes.icon}`]: {
          marginRight: "5px",
        },
        [`&.${classes.headerVal}`]: {
          backgroundColor: "#ccc",
        },
        [`& .${classes.header}`]: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: theme.spacing(2),
        },
        [`& .${classes.title}`]: {
          position: "relative",
          "&:after": {
            position: "absolute",
            bottom: -8,
            left: 0,
            content: '" "',
            height: 3,
            width: 48,
            backgroundColor: theme.palette.primary.main,
          },
        },
        [`&.${classes.actions}`]: {
          display: "flex",
          alignItems: "center",
        },
        [`& .${classes.sortButton}`]: {
          textTransform: "none",
          letterSpacing: 0,
        },
        [`& .${classes.paginate}`]: {
          display: "flex",
          justifyContent: "center",
        },
      }));

      useEffect(() => {
        setMode("grid");
        // if (permissions === CO_ROLE_PPA) {
        //   getTrace(" All Requests listed.(PPA)", "ev-041", userInfoReducer.email);
        // } else if (permissions === CO_ROLE_MRA) {
        //   getTrace(" All Requests listed.(MRA)", "ev-092", userInfoReducer.email);
        // } else if (permissions === CO_ROLE_PATIENT) {
        //   getTrace(
        //     " All Requests listed.(Patient)",
        //     "ev-125",
        //     userInfoReducer.email,
        //   );
        // }
      }, [permissions]);


      return {StyledDiv}
}

export default useRequestList