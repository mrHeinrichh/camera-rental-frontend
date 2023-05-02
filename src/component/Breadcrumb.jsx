import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { generateKey } from "@/services/generateKey";

export default function () {
  const location = useLocation();
  const breadcrumbs = location.pathname.split("/");
  breadcrumbs.shift();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      {breadcrumbs.map((e, index) => (
        <Link
          key={generateKey(5)}
          to={`/${breadcrumbs.slice(0, index + 1).join("/")}`}
          style={{ textDecoration: "none" }}
        >
          <Typography
            color="text.primary"
            sx={{
              cursor: "pointer",
              borderRadius: "0.5rem",
              padding: ".25rem .5rem",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "#f1f2f6",
                color: "#2c3e50",
                transition: "transform 0.2s ease-in-out",
                transform: "scale(1.1)",
              },
            }}
          >
            {e}
          </Typography>
        </Link>
      ))}
    </Breadcrumbs>
  );
}
