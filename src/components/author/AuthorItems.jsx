import React from "react";
import { Link } from "react-router-dom";

const SkeletonCard = () => (
  <div className="nft__item">
    <div
      className="skeleton"
      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
    ></div>
    <div
      className="skeleton"
      style={{ height: "260px", marginTop: "16px" }}
    ></div>
    <div
      className="skeleton"
      style={{ width: "65%", height: "18px", marginTop: "20px" }}
    ></div>
    <div
      className="skeleton"
      style={{ width: "35%", height: "14px", marginTop: "12px" }}
    ></div>
  </div>
);

const AuthorItems = ({ items, authorImage, loading }) => {
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {loading &&
            new Array(8).fill(0).map((_, index) => (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={index}
              >
                <SkeletonCard />
              </div>
            ))}

          {!loading &&
            items.map((item) => (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={item.id}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to="">
                      <img className="lazy" src={authorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a
                            href="https://www.facebook.com/sharer/sharer.php"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a
                            href="https://twitter.com/intent/tweet"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="mailto:">
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
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;