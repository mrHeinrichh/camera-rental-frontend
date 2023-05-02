import React from "react";
import WelcomeNav from "../component/WelcomeNav";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import camera1 from "../assets/camera1.jpg";
import camera2 from "../assets/camera2.jpg";
import camera3 from "../assets/camera3.jpg";

export default function Welcome() {
  return (
    <div>
      <WelcomeNav />
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={camera1} alt="Camera" />
          <Carousel.Caption>
            <h3>Camera</h3>
            <p>A close-up of a camera.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={camera2} alt="Camera Lens" />
          <Carousel.Caption>
            <h3>Camera Lens</h3>
            <p>A close-up of a camera lens.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={camera3} alt="Film Camera" />
          <Carousel.Caption>
            <h3>Film Camera</h3>
            <p>A vintage film camera on a wooden table.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
