import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EthImage from "../images/ethereum.svg";

const DEFAULT_NFT_ID = "17914494";
const API_BASE =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=";

const PersonSkeleton = () => (
  <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
    <div
      className="skeleton"
      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
    ></div>
    <div
      className="skeleton"
      style={{ width: "140px", height: "16px", marginLeft: "16px" }}
    ></div>
  </div>
);

const ItemSkeleton = () => (
  <div className="row">
    <div className="col-md-6 text-center">
      <div
        className="skeleton"
        style={{ width: "100%", height: "480px", maxWidth: "100%" }}
      ></div>
    </div>
    <div className="col-md-6">
      <div className="item_info">
        <div
          className="skeleton"
          style={{ width: "70%", height: "36px" }}
        ></div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <div
            className="skeleton"
            style={{ width: "70px", height: "30px" }}
          ></div>
          <div
            className="skeleton"
            style={{ width: "70px", height: "30px", marginLeft: "12px" }}
          ></div>
        </div>
        <div
          className="skeleton"
          style={{ width: "100%", height: "14px", marginTop: "24px" }}
        ></div>
        <div
          className="skeleton"
          style={{ width: "90%", height: "14px", marginTop: "10px" }}
        ></div>
        <div
          className="skeleton"
          style={{ width: "60%", height: "14px", marginTop: "10px" }}
        ></div>
        <h6 style={{ marginTop: "30px" }}>Owner</h6>
        <PersonSkeleton />
        <h6 style={{ marginTop: "30px" }}>Creator</h6>
        <PersonSkeleton />
        <h6 style={{ marginTop: "30px" }}>Price</h6>
        <div
          className="skeleton"
          style={{ width: "100px", height: "32px", marginTop: "10px" }}
        ></div>
      </div>
    </div>
  </div>
);

const ItemDetails = () => {
  const { nftId } = useParams();
  const id = nftId || DEFAULT_NFT_ID;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadItem() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_BASE + id);
        if (!response.ok) {
          throw new Error("Request failed: " + response.status);
        }
        const data = await response.json();
        if (!cancelled) {
          setItem(data);
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

    loadItem();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            {loading && <ItemSkeleton />}

            {error && (
              <div className="text-center">
                <p>Could not load this item.</p>
              </div>
            )}

            {!loading && !error && item && (
              <div className="row">
                <div className="col-md-6 text-center">
                  <img
                    src={item.nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt={item.title}
                  />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <h2>
                      {item.title} #{item.tag}
                    </h2>

                    <div className="item_info_counts">
                      <div className="item_info_views">
                        <i className="fa fa-eye"></i>
                        {item.views}
                      </div>
                      <div className="item_info_like">
                        <i className="fa fa-heart"></i>
                        {item.likes}
                      </div>
                    </div>
                    <p>{item.description}</p>
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={"/author/" + item.ownerId}>
                              <img
                                className="lazy"
                                src={item.ownerImage}
                                alt={item.ownerName}
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={"/author/" + item.ownerId}>
                              {item.ownerName}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                    <div className="de_tab tab_simple">
                      <div className="de_tab_content">
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={"/author/" + item.creatorId}>
                              <img
                                className="lazy"
                                src={item.creatorImage}
                                alt={item.creatorName}
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={"/author/" + item.creatorId}>
                              {item.creatorName}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="spacer-40"></div>
                      <h6>Price</h6>
                      <div className="nft-item-price">
                        <img src={EthImage} alt="" />
                        <span>{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;