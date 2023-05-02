import Button from "@mui/material/Button";

function ButtonComponent(props) {
  const { title = "", onClick = () => {} } = props;

  return (
    <>
      <Button
        onClick={() => {
          onClick();
        }}
        sx={{
          marginBottom: "1rem",
          color: "#f1f2f6",
          backgroundColor: "#2c3e50",
          "&:hover": {
            backgroundColor: "#2c3e50",
            color: "#f1f2f6",
            transition: "transform 0.2s ease-in-out",
            transform: "scale(1.1)",
          },
        }}
      >
        {title}
      </Button>
    </>
  );
}

export default ButtonComponent;
