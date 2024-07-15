import React, { useState } from "react";
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starContainerStyle = {
  display: "flex",
  gap: "4px",
};
const textStyle = {
  lineHeight: "1",
  margin: "0",
};
export default function StarRating({ maxRating = 5, setUserRating }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  function onClickStar(index) {
    setRating(index);
    setUserRating(index);
  }
  function handleMouseEnter(index) {
    setTempRating(index);
  }
  function handleMouseLeave() {
    setTempRating(0);
  }
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            index={i + 1}
            rating={rating}
            onClickStar={onClickStar}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            tempRating={tempRating}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating === 0 ? rating || "" : tempRating}</p>
    </div>
  );
}
function Star({
  index,
  rating,
  onClickStar,
  handleMouseEnter,
  handleMouseLeave,
  tempRating,
}) {
  return (
    <span
      role="button"
      onClick={() => {
        onClickStar(index);
      }}
      onMouseEnter={() => {
        handleMouseEnter(index);
      }}
      onMouseLeave={() => {
        handleMouseLeave();
      }}
    >
      {tempRating === 0 ? (
        index <= rating ? (
          <i className="fa-solid fa-star"></i>
        ) : (
          <i className="fa-regular fa-star"></i>
        )
      ) : index <= tempRating ? (
        <i className="fa-solid fa-star"></i>
      ) : (
        <i className="fa-regular fa-star"></i>
      )}
    </span>
  );
}
