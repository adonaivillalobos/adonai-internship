import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";

const DEFAULT_AUTHOR_ID = "73855012";
const API_BASE =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=";

const Author = () => {
  const { authorId } = useParams();
  const id = authorId || DEFAULT_AUTHOR_ID;

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAuthor() {
      setLoading(true);
      setError(null);
      setIsFollowing(false);

      try {
        const response = await fetch(API_BASE + id);
        if (!response.ok) {
          throw new Error("Request failed: " + response.status);
        }
        const data = await response.json();
        if (!cancelled) {
          setAuthor(data);
          setFollowers(data.followers);
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

    loadAuthor();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleFollow = (e) => {
    e.preventDefault();
    setFollowers((count) => (isFollowing ? count - 1 : count + 1));
    setIsFollowing((value) => !value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(author.address);
    } catch (err) {
      console.error("Could not copy:", err);
    }
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            {loading && (
              <div className="text-center">
                <p>Loading...</p>
              </div>
            )}

            {error && (
              <div className="text-center">
                <p>Could not load this author.</p>
              </div>
            )}

            {!loading && !error && author && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={author.authorImage} alt={author.authorName} />

                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {author.authorName}
                            <span className="profile_username">
                              @{author.tag}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button
                              id="btn_copy"
                              title="Copy Text"
                              onClick={handleCopy}
                            >
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {followers} followers
                        </div>
                        <Link
                          to="#"
                          className="btn-main"
                          onClick={handleFollow}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems
                      items={author.nftCollection}
                      authorImage={author.authorImage}
                    />
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

export default Author;