import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";

const arrowStyle = {
  position: "absolute",
  top: "40%",
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

const SkeletonCard = () => (
  <div className="nft_coll" style={{ margin: 0 }}>
    <div
      className="skeleton"
      style={{ height: "180px", borderRadius: "8px 8px 0 0" }}
    ></div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0 24px",
      }}
    >
      <div
        className="skeleton"
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      ></div>
      <div
        className="skeleton"
        style={{ width: "60%", height: "18px", marginTop: "16px" }}
      ></div>
      <div
        className="skeleton"
        style={{ width: "35%", height: "14px", marginTop: "10px" }}
      ></div>
    </div>
  </div>
);

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCollections() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Request failed: " + response.status);
        }
        const data = await response.json();
        if (!cancelled) {
          setCollections(data);
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

    loadCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && (
            <div className="col-lg-12">
              <div className="row">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    key={i}
                  >
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="col-lg-12 text-center">
              <p>Could not load collections.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="col-lg-12">
              <Slider {...sliderSettings}>
                {collections.map((collection) => (
                  <div key={collection.id}>
                    <div className="nft_coll" style={{ margin: "0 15px" }}>
                      <div className="nft_wrap">
                        <Link to={"/item-details/" + collection.nftId}>
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt={collection.title}
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to={"/author/" + collection.authorId}>
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
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

export default HotCollections;