import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

const arrowStyle = {
  position: "absolute",
  top: "45%",
  zIndex: 2,
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#333",
  fontSize: "22px",
  lineHeight: "1",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
};

const Arrow = ({ direction, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === "left" ? "Previous" : "Next"}
    style={{
      ...arrowStyle,
      [direction === "left" ? "left" : "right"]: "-10px",
    }}
  >
    {direction === "left" ? "‹" : "›"}
  </button>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 400,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: <Arrow direction="left" />,
  nextArrow: <Arrow direction="right" />,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 992, settings: { slidesToShow: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1 } },
  ],
};

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(expiryDate - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(expiryDate - Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [expiryDate]);

  if (timeLeft <= 0) {
    return <div className="de_countdown">Expired</div>;
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="de_countdown">
      {hours}h {minutes}m {seconds}s
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Request failed: " + response.status);
        }
        const data = await response.json();
        if (!cancelled) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && (
            <div className="col-lg-12 text-center">
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="col-lg-12 text-center">
              <p>Could not load items.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="col-lg-12">
              <Slider {...sliderSettings}>
                {items.map((item) => (
                  <div key={item.id}>
                    <div className="nft__item" style={{ margin: "0 15px" }}>
                      <div className="author_list_pp">
                        <Link
                          to={"/author/" + item.authorId}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={"Creator ID: " + item.authorId}
                        >
                          <img className="lazy" src={item.authorImage} alt="" />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      {item.expiryDate && (
                        <Countdown expiryDate={item.expiryDate} />
                      )}

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href="" target="_blank" rel="noreferrer">
                                <i className="fa fa-facebook fa-lg"></i>
                              </a>
                              <a href="" target="_blank" rel="noreferrer">
                                <i className="fa fa-twitter fa-lg"></i>
                              </a>
                              <a href="">
                                <i className="fa fa-envelope fa-lg"></i>
                              </a>
                            </div>
                          </div>
                        </div>

                        <Link to={"/item-details/" + item.nftId}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.title}
                          />
                        </Link>
                      </div>
                      <div className="nft__item_info">
                        <Link to={"/item-details/" + item.nftId}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price} ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;