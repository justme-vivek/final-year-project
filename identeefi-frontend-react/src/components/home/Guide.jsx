import { Box, Button, styled, Typography } from "@mui/material";
import React from "react";

import CustomButton from "./CustomButton";

const Guide = () => {
  const CustomBox = styled(Box)(({ theme }) => ({
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "85%",
    },
  }));

    return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
       
        alignItems: "center",
       
        backgroundColor: '#050816'
      }}
    >
      <div
        style={{
          width: "5%",
          height: "5px",
          backgroundColor: "#000339",
          margin: "0 auto",
        }}
      ></div>

      <Typography
        variant="h3"
        sx={{ fontSize: "35px", fontWeight: "bold", color: "white", my: 3 }}
      >
        How it works?
      </Typography>

      <CustomBox>
        <Typography
          variant="body2"
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            color: "#5A6473",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Our fake product identification system using blockchain technology assigns a unique digital ID to each product that is recorded on the blockchain. Consumers can scan the product's QR code or enter its digital ID on our website to verify its authenticity and ensure it has not been tampered with or counterfeited. By leveraging the security and transparency of the blockchain, our system provides a reliable and efficient way to combat product counterfeiting and protect consumers' safety and trust.
        </Typography>
      </CustomBox>

      <CustomButton
        backgroundColor="#0F1B4C"
        color="#fff"
        buttonText="See Full Guides"
        guideBtn={true}
      />
    </Box>
  );
};

export default Guide;
