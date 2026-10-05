import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const PAGE_SIZE = 8;

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(expiryDate - Date.now());

  useEffect(() => {
    setTimeLeft(expiryDate - Date.now());

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

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const url = filter ? API_URL + "?filter=" + filter : API_URL;
        const response = await fetch(url);
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
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount((count) => count + PAGE_SIZE);
  };

  const visibleItems = items.slice(0, visibleCount);

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading && (
        <div className="col-md-12 text-center">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="col-md-12 text-center">
          <p>Could not load items.</p>
        </div>
      )}

      {!loading &&
        !error &&
        visibleItems.map((item) => (
          <div
            key={item.id}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
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

              {item.expiryDate && <Countdown expiryDate={item.expiryDate} />}

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

      {!loading && !error && visibleCount < items.length && (
        <div className="col-md-12 text-center">
          <Link
            to=""
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;