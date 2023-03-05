import React from "react";
import Image from "./Image";
import { Button, IconButton } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { ColorRing } from "react-loader-spinner";

const SmallPreviewImage = ({
  previewImgSource,
  isLoading,
  handleClick,
  crossClick,
}) => {
  return (
    <>
      <div className="preview__img__container">
        <Image
          className="preview__img"
          imageSource={previewImgSource}
          alt="preview img"
          loading="lazy"
        />

        <IconButton
          color="primary"
          component="label"
          title="close"
          sx={{
            alignSelf: "flex-start",
          }}
          onClick={crossClick}
        >
          <RxCross2 />
        </IconButton>
      </div>

      {isLoading ? (
        <div className="preview__img__container">
          <ColorRing
            visible={true}
            height="42"
            width="42"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <Button onClick={handleClick} variant="contained">
          send
        </Button>
      )}
    </>
  );
};

export default SmallPreviewImage;
