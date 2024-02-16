// import myVideo from "../images/newvideo.mp4";
import React from "react";
import LinkIcon from "@mui/icons-material/Link";
import { Diversity3 } from "@mui/icons-material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TourFeedback from "../../../../components/joyride/tourFeedback";
import conclusionBanner from "../../../../images/tourImages/conclusionBanner.jpg"
import startImage from "../../../../images/tourImages/tourStartImage.jpg";
import integrationIcon from "../../../../images/tourImages/IntegrationIcon.jpg";
import ppa from "../../../../images/tourImages/ppa.jpg";
import { Avatar, Grid, Typography } from "@mui/material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
export const TOUR_CONSTANTS = {
  Dashboard: {
    patient: [
      {
        content: (
          <Grid
            container
            style={{
              textAlign: "center",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Grid item md={12} xs={12}>
              <img src={startImage} style={{ width: "100%" }} />
              <h2>Welcome to Unblock Health!</h2>
              <div style={{ width: "100%", textAlign: "left" }}>
                <Typography variant="subtitle1">
                  The Unblock Health platform let you easily manage requesting
                  medical records from your providers/physician/labs/imaging
                  centers/emergency services and it comes with a whole bunch of
                  powerful features.
                </Typography>
              </div>
            </Grid>
            <Grid item md={12} xs={12} style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <AssignmentIcon style={{ fontSize: "20px", marginRight: "20px" }} />

                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Request Medical Records
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Diversity3 style={{ fontSize: "20px", marginRight: "20px" }} />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Patients and families
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Avatar
                  alt=" "
                  src={ppa}
                  style={{ width: "20px", height: "20px", marginRight: "20px" }} // Adjust the width and height as needed
                />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "25px" }}
                >
                  Professional Patient Advocate
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <ApartmentIcon style={{ fontSize: "20px", marginRight: "20px" }} />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Healthcare services and facilities
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Avatar
                  alt=" "
                  src={integrationIcon}
                  style={{ width: "20px", height: "20px", marginRight: "20px" }} // Adjust the width and height as needed
                />{" "}
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Integrations and sharing
                </Typography>
              </div>
            </Grid>
            {/* <video width="320" height="240" controls autoPlay>
                <source src={myVideo} type="video/mp4"></source>
              </video> */}
          </Grid>
        ),
        locale: {
          skip: <strong aria-label="skip">Skip</strong>,
          next: (
            <strong aria-label="skip">
              <div style={{ display: "flex", alignItems: "center" }}>
                <RocketLaunchIcon
                  style={{ color: "#529a6f", paddingRight: "5px" }}
                />
                Take a quick tour
              </div>
            </strong>
          ),
        },
        placement: "center",
        target: "body",
        showProgress: false,
        disableBeacon: true,
      },
      {
        target: "#dashboard-menu",
        content: (
          <div style={{ textAlign: "left" }}>
            <div style={{ textAlign: "center" }}>
              <h2>Dashboard</h2>
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                Welcome to the Dashboard! Although currently not displaying
                metrics, and other widgets, this central space offers essential
                options for your convenience.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
                textAlign: "left",
              }}
            >
              {" "}
              <AssignmentIcon style={{ marginRight: "10px" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                {" "}
                Create Medical Records Requests
              </Typography>
            </div>
            <Typography variant="subtitle1">
              <ul>
                <li>
                  {" "}
                  Initiate the process of recording your medical information.
                  Click here to seamlessly create and manage your medical
                  records.
                </li>
              </ul>
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {" "}
              <LinkIcon style={{ marginRight: "10px" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                {" "}
                Link to Unblock.Health Public Site
              </Typography>
            </div>
            <Typography variant="subtitle1">
              <ul>
                <li>
                  Explore the public site to find the latest updates, community
                  resources, and important announcements
                </li>
              </ul>
            </Typography>
          </div>
        ),
        placement: "right",
      },

      {
        target: "#requests-menu",
        content: (
          <Grid item md={12} xs={12}>
            <div style={{ textAlign: "center" }}>
              <h2>My Requests</h2>
              <div style={{ width: "100%", textAlign: "left" }}>
                <Typography variant="subtitle1">
                  Your <b>"My Requests"</b> section serves as your central hub
                  for managing and tracking your medical requests. It provides a
                  comprehensive overview of all your submitted requests,
                  including their status and relevant information.
                </Typography>
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <Typography variant="subtitle1">
                <ul>
                  <li>
                    <b>View Request Summary</b>: Gain a quick overview of all
                    your submitted requests, including their purpose, status,
                    and key details.
                  </li>
                  <li>
                    <b>Monitor Request Status</b>: Stay informed about the
                    progress of each request, from submission to completion.
                  </li>
                  <li>
                    <b>Access Detailed Information</b>: Delve into the specifics
                    of each request by clicking on it to view its complete
                    details, including attachments and comments.
                  </li>
                  <li>
                    <b>Download your Request</b>: Easily download copies of your
                    request documents for your personal records
                  </li>
                </ul>
              </Typography>
            </div>
          </Grid>
        ),
        placement: "right",
      },
      {
        target: "#mrr-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Create Medical Records</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to create new medical records for
                yourself or your dependents. You can enter your personal
                information, medical history, and insurance information.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#invite-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Invite Users</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to invite a Professional Patient
                Advocate, Patient or HDOs to the system.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#dependent-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Dependents</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to view the list of all dependents
                associated with you. You can add, edit, delete or invite
                patients from this menu.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#accountSettings",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Account Settings</h2>
            <div style={{ width: "100%", textAlign: "justify" }}>
              <Typography variant="subtitle1">
                Welcome to your personal settings hub! This is where you can
                manage your profile information, verify your identity using IAL2
                personal identity verification, update your profile picture, and
                more. Explore the various settings options to tailor your
                account experience to your preferences.
              </Typography>
            </div>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: "#notification",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Notifications</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                Here you can see the notifications of main activities associated
                with the user.
              </Typography>
            </div>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: "body",
        content: (
          <div style={{ textAlign: "center" }}>
            <img src={conclusionBanner} style={{ width: "100%" }} />
            <h2>
              Congratulations. <br></br>You've finished the tour!
            </h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                We're currently developing a comprehensive <b>FAQs</b> section
                and a dedicated <b>Help center</b> to enhance your self-learning
                experience.
              </Typography>
              <Typography variant="subtitle1">
                We value your feedback to help us make your experience even
                better. Please rate and share your thoughts with us below.
              </Typography>
            </div>
            <TourFeedback />
          </div>
        ),
        disableBeacon: true,
        placement: "center",
        showProgress: false,
      },
    ],
    ppa: [
      {
        content: (
          <Grid
            container
            style={{
              textAlign: "center",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Grid item md={12} xs={12}>
              <img src={startImage} style={{ width: "100%" }} />
              <h2>Welcome to Unblock Health!</h2>
              <div style={{ width: "100%", textAlign: "left" }}>
                <Typography variant="subtitle1">
                  The Unblock Health platform let you easily manage requesting
                  medical records from your providers/physician/labs/imaging
                  centers/emergency services and it comes with a whole bunch of
                  powerful features.
                </Typography>
              </div>
            </Grid>
            <Grid item md={12} xs={12} style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Assignment style={{ fontSize: "20px", marginRight: "20px" }} />

                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Request Medical Records
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Diversity3 style={{ fontSize: "20px", marginRight: "20px" }} />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Patients and families
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Avatar
                  alt=" "
                  src={ppa}
                  style={{ width: "20px", height: "20px", marginRight: "20px" }} // Adjust the width and height as needed
                />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "25px" }}
                >
                  Professional Patient Advocate
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Apartment style={{ fontSize: "20px", marginRight: "20px" }} />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Healthcare services and facilities
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Avatar
                  alt=" "
                  src={integrationIcon}
                  style={{ width: "20px", height: "20px", marginRight: "20px" }} // Adjust the width and height as needed
                />{" "}
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Integrations and sharing
                </Typography>
              </div>
            </Grid>
            {/* <video width="320" height="240" controls autoPlay>
                <source src={myVideo} type="video/mp4"></source>
              </video> */}
          </Grid>
        ),
        locale: {
          skip: <strong aria-label="skip">Skip</strong>,
          next: (
            <strong aria-label="skip">
              <div style={{ display: "flex", alignItems: "center" }}>
                <RocketLaunchIcon
                  style={{ color: "#529a6f", paddingRight: "5px" }}
                />
                Take a quick tour
              </div>
            </strong>
          ),
        },
        placement: "center",
        target: "body",
        showProgress: false,
        disableBeacon: true,
      },
      {
        target: "#dashboard-menu",
        content: (
          <div style={{ textAlign: "left" }}>
            <div style={{ textAlign: "center" }}>
              <h2>Dashboard</h2>
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                Welcome to the Dashboard! Although currently not displaying
                metrics, and other widgets, this central space offers essential
                options for your convenience.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
                textAlign: "left",
              }}
            >
              {" "}
              <Assignment style={{ marginRight: "10px" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                {" "}
                Create Medical Records Requests
              </Typography>
            </div>
            <Typography variant="subtitle1">
              <ul>
                <li>
                  {" "}
                  Initiate the process of recording your medical information.
                  Click here to seamlessly create and manage your medical
                  records.
                </li>
              </ul>
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {" "}
              <LinkIcon style={{ marginRight: "10px" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                {" "}
                Link to Unblock.Health Public Site
              </Typography>
            </div>
            <Typography variant="subtitle1">
              <ul>
                <li>
                  Explore the public site to find the latest updates, community
                  resources, and important announcements
                </li>
              </ul>
            </Typography>
          </div>
        ),
        placement: "right",
      },

      {
        target: "#requests-menu",
        content: (
          <>
            <div style={{ textAlign: "center" }}>
              <h2>My Requests</h2>
              <div style={{ width: "100%", textAlign: "left" }}>
                <Typography variant="subtitle1">
                  Your <b>"My Requests"</b> section serves as your central hub
                  for managing and tracking your medical requests. It provides a
                  comprehensive overview of all your submitted requests,
                  including their status and relevant information.
                </Typography>
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <Typography variant="subtitle1">
                <ul>
                  <li>
                    <b>View Request Summary</b>: Gain a quick overview of all
                    your submitted requests, including their purpose, status,
                    and key details.
                  </li>
                  <li>
                    <b>Monitor Request Status</b>: Stay informed about the
                    progress of each request, from submission to completion.
                  </li>
                  <li>
                    <b>Access Detailed Information</b>: Delve into the specifics
                    of each request by clicking on it to view its complete
                    details, including attachments and comments.
                  </li>
                  <li>
                    <b>Download your Request</b>: Easily download copies of your
                    request documents for your personal records
                  </li>
                </ul>
              </Typography>
            </div>
          </>
        ),
        placement: "right",
      },
      {
        target: "#mrr-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Create Medical Records</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to create new medical records for your
                patients. You can enter personal information of the patient,
                medical history, and insurance information.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#arr-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Create Addendum Requests</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to create new amendment/correction
                request for your patients.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#billing-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Create Billing Requests</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to create new billing/insurance requests
                for your patients.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#invite-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Invite Users</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to invite a Professional Patient
                Advocate, Patient or HDOs to the system.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#patient-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Patients</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to view the list of all patients
                associated with you. You can add, edit, delete or invite
                patients from this menu.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#accountSettings",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Account Settings</h2>
            <div style={{ width: "100%", textAlign: "justify" }}>
              <Typography variant="subtitle1">
                Welcome to your personal settings hub! This is where you can
                manage your profile information, verify your identity using IAL2
                personal identity verification, update your profile picture, and
                more. Explore the various settings options to tailor your
                account experience to your preferences.
              </Typography>
            </div>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: "#notification",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Notifications</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                Here you can see the notifications of main activities associated
                with the user.
              </Typography>
            </div>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: "body",
        content: (
          <div style={{ textAlign: "center" }}>
            <img src={conclusionBanner} style={{ width: "100%" }} />
            <h2>
              Congratulations. <br></br>You've finished the tour!
            </h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                We're currently developing a comprehensive <b>FAQs</b> section
                and a dedicated <b>Help center</b> to enhance your self-learning
                experience.
              </Typography>
              <Typography variant="subtitle1">
                We value your feedback to help us make your experience even
                better. Please rate and share your thoughts with us below.
              </Typography>
            </div>
            <TourFeedback />
          </div>
        ),
        disableBeacon: true,
        placement: "center",
        showProgress: false,
      },
    ],
    mra: [
      {
        content: (
          <Grid
            container
            style={{
              textAlign: "center",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Grid item md={12} xs={12}>
              <img src={startImage} style={{ width: "100%" }} />
              <h2>Welcome to Unblock Health!</h2>
              <div style={{ width: "100%", textAlign: "left" }}>
                <Typography variant="subtitle1">
                  The Unblock Health platform let you easily manage requesting
                  medical records from your providers/physician/labs/imaging
                  centers/emergency services and it comes with a whole bunch of
                  powerful features.
                </Typography>
              </div>
            </Grid>
            <Grid item md={12} xs={12} style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Assignment style={{ fontSize: "20px", marginRight: "20px" }} />

                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Request Medical Records
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Diversity3 style={{ fontSize: "20px", marginRight: "20px" }} />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Patients and families
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Avatar
                  alt=" "
                  src={ppa}
                  style={{ width: "20px", height: "20px", marginRight: "20px" }} // Adjust the width and height as needed
                />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "25px" }}
                >
                  Professional Patient Advocate
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Apartment style={{ fontSize: "20px", marginRight: "20px" }} />
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Healthcare services and facilities
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginLeft: "20%",
                }}
              >
                <Avatar
                  alt=" "
                  src={integrationIcon}
                  style={{ width: "20px", height: "20px", marginRight: "20px" }} // Adjust the width and height as needed
                />{" "}
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "600", lineHeight: "15px" }}
                >
                  Integrations and sharing
                </Typography>
              </div>
            </Grid>
            {/* <video width="320" height="240" controls autoPlay>
                <source src={myVideo} type="video/mp4"></source>
              </video> */}
          </Grid>
        ),
        locale: {
          skip: <strong aria-label="skip">Skip</strong>,
          next: (
            <strong aria-label="skip">
              <div style={{ display: "flex", alignItems: "center" }}>
                <RocketLaunchIcon
                  style={{ color: "#529a6f", paddingRight: "5px" }}
                />
                Take a quick tour
              </div>
            </strong>
          ),
        },
        placement: "center",
        target: "body",
        showProgress: false,
        disableBeacon: true,
      },
      {
        target: "#dashboard-menu",
        content: (
          <div style={{ textAlign: "left" }}>
            <div style={{ textAlign: "center" }}>
              <h2>Dashboard</h2>
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                Welcome to the Dashboard! Although currently not displaying
                metrics, and other widgets, this central space offers essential
                options for your convenience.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {" "}
              <LinkIcon style={{ marginRight: "10px" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                {" "}
                Link to Unblock.Health Public Site
              </Typography>
            </div>
            <Typography variant="subtitle1">
              <ul>
                <li>
                  Explore the public site to find the latest updates, community
                  resources, and important announcements
                </li>
              </ul>
            </Typography>
          </div>
        ),
        placement: "right",
      },

      {
        target: "#requests-menu",
        content: (
          <>
            <div style={{ textAlign: "center" }}>
              <h2>My Tasks</h2>
              <div style={{ width: "100%", textAlign: "left" }}>
                <Typography variant="subtitle1">
                  Your <b>"My Tasks"</b> section serves as your central hub for
                  managing and tracking medical requests in your organization.
                  It provides a comprehensive overview of all your submitted
                  requests, including their status and relevant information.
                </Typography>
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <Typography variant="subtitle1">
                <ul>
                  <li>
                    <b>View Request Summary</b>: Gain a quick overview of all
                    your submitted requests, including their purpose, status,
                    and key details.
                  </li>
                  <li>
                    <b>Monitor Request Status</b>: Stay informed about the
                    progress of each request, from submission to completion.
                  </li>
                  <li>
                    <b>Access Detailed Information</b>: Delve into the specifics
                    of each request by clicking on it to view its complete
                    details, including attachments and comments.
                  </li>
                  <li>
                    <b>Download your Request</b>: Easily download copies of your
                    request documents for your personal records
                  </li>
                </ul>
              </Typography>
            </div>
          </>
        ),
        placement: "right",
      },
      {
        target: "#invite-menu",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Invite Users</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                This option allows you to invite a Professional Patient
                Advocate, Patient or HDOs to the system.
              </Typography>
            </div>
          </div>
        ),
        placement: "right",
      },
      {
        target: "#accountSettings",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Account Settings</h2>
            <div style={{ width: "100%", textAlign: "justify" }}>
              <Typography variant="subtitle1">
                Welcome to your personal settings hub! This is where you can
                manage your profile information, verify your identity using IAL2
                personal identity verification, update your profile picture, and
                more. Explore the various settings options to tailor your
                account experience to your preferences.
              </Typography>
            </div>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: "#notification",
        content: (
          <div style={{ textAlign: "center" }}>
            <h2>Notifications</h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                Here you can see the notifications of main activities associated
                with the user.
              </Typography>
            </div>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: "body",
        content: (
          <div style={{ textAlign: "center" }}>
            <img src={conclusionBanner} style={{ width: "100%" }} />
            <h2>
              Congratulations. <br></br>You've finished the tour!
            </h2>
            <div style={{ width: "100%", textAlign: "left" }}>
              <Typography variant="subtitle1">
                We're currently developing a comprehensive <b>FAQs</b> section
                and a dedicated <b>Help center</b> to enhance your self-learning
                experience.
              </Typography>
              <Typography variant="subtitle1">
                We value your feedback to help us make your experience even
                better. Please rate and share your thoughts with us below.
              </Typography>
            </div>
            <TourFeedback />
          </div>
        ),
        disableBeacon: true,
        placement: "center",
        showProgress: false,
      },
    ],
  },
  // mrr: [
  //   {
  //     target: "#source-institution",
  //     content: "Enter details of hospital,department and MRA.",
  //     placement: "center",
  //     disableBeacon: true,
  //   },
  //   {
  //     target: "#patient-info",
  //     content: "Enter details of patient here.",
  //   },
  //   {
  //     target: "#description",
  //     content: "Enter description of request here",
  //   },
  //   {
  //     target: "#inspect-copy",
  //     content: "Copy or inspect section",
  //   },
  //   {
  //     target: "#hipaa",
  //     content: "hipaa attach section",
  //   },
  //   {
  //     target: "#sud",
  //     content: "sensitive info attach section",
  //   },
  //   {
  //     target: "#patient-rep",
  //     content: "Personal representative section",
  //   },
  //   {
  //     target: "#additional-info",
  //     content: "Additional info section",
  //   },
  // ],
  // arr: [
  //   {
  //     target: "#addendum-patient-info",
  //     content: "Enter details of patient here.",
  //     disableBeacon: true,
  //   },
  //   {
  //     target: "#addendum-description",
  //     content: "Enter description of request here",
  //   },
  //   {
  //     target: "#addendum-form-attach",
  //     content: "Attach addendum form",
  //   },
  // ],
  // brr: [
  //   {
  //     target: "#billing-patient-info",
  //     content: "Enter details of patient here.",
  //     disableBeacon: true,
  //   },
  //   {
  //     target: "#billing-description",
  //     content: "Enter description of request here",
  //   },
  // ],
  // invite: [
  //   {
  //     target: "#requests",
  //     content: "Requests are listing  here.",
  //     disableBeacon: true,
  //   },
  // ],
  // request: [
  //   {
  //     target: "#requests",
  //     content: "Requests are listing  here.",
  //     disableBeacon: true,
  //   },
  //   {
  //     target: "#filter-sidebar",
  //     content: "Filter seelection",
  //   },
  //   {
  //     target: "#status",
  //     content: "Requests status here",
  //   },
  //   {
  //     target: "#hourglass",
  //     content: "Requests expire ",
  //   },
  //   {
  //     target: "#hipaa-filled",
  //     content: "Hipaa form filled ",
  //   },
  //   {
  //     target: "#hipaa-not-filled",
  //     content: "Hipaa form not filled",
  //   },
  //   {
  //     target: "#substance-disorder-filled",
  //     content: "Substance disorder form filled ",
  //   },
  //   {
  //     target: "#substance-disorder-not-filled",
  //     content: "Substance disorder form not filled ",
  //   },
  //   {
  //     target: "#signing-filled",
  //     content: "Signature  Filled ",
  //   },
  //   {
  //     target: "#signing-not-filled",
  //     content: "Signature not Filled ",
  //   },
  //   {
  //     target: "#download",
  //     content: "Download request",
  //   },
  //   {
  //     target: "#edit",
  //     content: "Edit request details",
  //   },
  //   {
  //     target: "#view-more",
  //     content: "View request details",
  //   },
  //   {
  //     target: "#delete",
  //     content: "Delete request ",
  //   },
  // ],
  // patient: [
  //   {
  //     target: "#patient-info",
  //     content: "Patients details are here.",
  //     disableBeacon: true,
  //   },
  // ],
};
