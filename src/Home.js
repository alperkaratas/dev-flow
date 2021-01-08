import "./App.css";
import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  Input,
  Card,
  Message,
  Image,
  Feed,
  List,
  Segment,
  Divider,
  Grid,
} from "semantic-ui-react";
import logo from "./logo.png";
import axios from "axios";
import moment from "moment";
import FlatList from "flatlist-react";

const Home = () => {
  const [githubSearch, setGithubSearch] = useState("");
  const [searchBarText, setSearchBarText] = useState("");
  const [getUserData, setGetUserData] = useState([{}]);
  const [userStatus, setUserStatus] = useState("400");
  const [getRepoName, setGetRepoName] = useState([{}]);
  const [getEventsData, setGetEventsData] = useState([]);

  const githubAvatar = `https://avatars.githubusercontent.com/${githubSearch}`;

  const getUsersData = async () => {
    const response = await axios.get(
      `https://api.github.com/users/${githubSearch}`,
      {
        headers: {
          Authorization: "d4b4841127d390e1c0c425da6b131a378d19f34c",
        },
      }
    );
    setGetUserData(response.data);
    setUserStatus(response.status);
    console.log(userStatus);
  };

  const getRepo = async () => {
    const response = await axios.get(
      `https://api.github.com/users/${githubSearch}/repos`,
      {
        headers: {
          Authorization: "d4b4841127d390e1c0c425da6b131a378d19f34c",
        },
      }
    );
    setGetRepoName(response.data);
    console.log(getRepoName);
  };

  const getEventData = async () => {
    const response1 = await axios.get(
      ` https://api.github.com/users/${githubSearch}/events`,
      {
        headers: {
          Authorization: "8b67a6f6ad199d10ff2ebffee22473907197925e",
        },
      }
    );
    setGetEventsData(response1.data);
    console.log(getEventsData);
  };

  const getAllData = () => {
    getUsersData();
    getRepo();
    getEventData();
    setGithubSearch("alperkaratas");
    console.log(getRepoName.name);
    console.log(userStatus);
  };
  {
    /*useEffect(() => {
    getAllData();
  });*/
  }

  const renderEvent = (item, idx) => {
    const navigateRepo = `https://github.com/${item.repo.name}`;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Feed>
          <Feed.Event>
            <Feed.Label>
              <img src={githubAvatar} />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>{getUserData.name}</Feed.User> {item.type}
              </Feed.Summary>
              <Feed.Meta on>
                <Feed.Like>
                  <Icon name="linkify" />{" "}
                  <a href={navigateRepo} target="_blank">
                    {item.repo.name}
                  </a>
                </Feed.Like>
                <Feed.Extra>
                  Action:{" "}
                  {item.payload.action == null ? "pushed" : item.payload.action}{" "}
                  @ {moment(item.created_at).format("Do MMM YYYY")}
                </Feed.Extra>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
          <Divider className="divider-a" />
        </Feed>
      </div>
    );
  };

  const githubGraph = `https://grass-graph.moshimo.works/images/${githubSearch}.png`;
  const githubStats = `https://github-readme-stats.vercel.app/api?username=${githubSearch}&show_icons=true&theme=default`;
  return (
    <div className="App">
      <div className="App-logo">
        <img width={90} height={90} src={logo} alt="Logo" />
      </div>
      <div className="button-container">
        <Button
          onClick={() =>
            window.open(
              "https://www.linkedin.com/in/alper-karata%C5%9F-071095109/",
              "_blank"
            )
          }
          color="linkedin"
        >
          <Icon name="linkedin" /> LinkedIn
        </Button>
        <Button
          onClick={() =>
            window.open("https://github.com/alperkaratas", "_blank")
          }
          color="black"
        >
          <Icon name="github" /> GitHub
        </Button>
        <Button
          onClick={() =>
            window.open("https://twitter.com/alpkaratass", "_blank")
          }
          color="twitter"
        >
          <Icon name="twitter" /> Twitter
        </Button>
        <Button
          className="search-logo"
          onClick={() => window.open("mailto:alpkrts3@gmail.com")}
          color="red"
        >
          <Icon name="mail outline" /> Mail
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <div className="search-button">
            <Input
              size="big"
              icon="github"
              iconPosition="left"
              placeholder="Search users..."
              onChange={(text) => setSearchBarText(text)}
            />
            <div style={{ marginLeft: 5 }}>
              <Button onClick={() => getAllData()} circular icon="search" />
            </div>
          </div>
          {githubSearch === "" && userStatus != "200" ? (
            <div
              style={{
                margin: 20,
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Message info>
                <Message.Header className="text-25">
                  How it works?
                </Message.Header>
                <p style={{ marginTop: 10 }}>
                  Enter the username of the person whose GitHub status you want
                  to see and review it 🙂
                </p>
              </Message>
            </div>
          ) : userStatus == "200" ? (
            <div>
              <div style={{ margin: 20, marginTop: 50 }}>
                <div
                  style={{
                    margin: 20,
                    marginTop: 50,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Card>
                    <Image src={githubAvatar} wrapped ui={false} />
                    <Card.Content>
                      <Card.Header>{githubSearch}</Card.Header>
                      <Card.Meta>
                        <span className="date">{getUserData.name}</span>
                      </Card.Meta>
                      <Card.Description>{getUserData.bio}</Card.Description>
                      <Card.Description className="user-location">
                        {getUserData.location}
                      </Card.Description>
                      {getUserData.twitter_username == null ? null : (
                        <Card.Description className="user-location">
                          <button
                            onClick={() =>
                              window.open(
                                `https://twitter.com/${getUserData.twitter_username}`,
                                "_blank"
                              )
                            }
                            color="twitter"
                            class="circular ui icon button"
                          >
                            <i class="icon twitter" color="twitter"></i>
                          </button>
                          <button
                            onClick={() =>
                              window.open(
                                `https://github.com/${githubSearch}`,
                                "_blank"
                              )
                            }
                            class="circular ui icon button"
                          >
                            <i class="icon github" color="github"></i>
                          </button>
                        </Card.Description>
                      )}
                    </Card.Content>
                  </Card>
                </div>
                <div style={{ marginTop: 30 }}>
                  <img src={githubStats} />
                </div>
                <div style={{ marginTop: 30 }}>
                  <img src={githubGraph} />
                </div>
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://twitter.com/intent/tweet?text=Hey!%20You%20can%20see%20my%20GitHub%20summary%20here 👉 &url=http://localhost:3001/alperkaratas",
                        "_blank"
                      )
                    }
                    color="twitter"
                  >
                    <Icon name="twitter" /> Share on Twitter
                  </Button>
                </div>
                <div>
                  <Card.Group className="repos-container" itemsPerRow={3}>
                    {getRepoName[0] == null ? null : (
                      <Card
                        onClick={() =>
                          window.open(getRepoName[0].html_url, "_blank")
                        }
                        color="red"
                        image={`https://github-readme-stats.vercel.app/api/pin/?username=${githubSearch}&repo=${getRepoName[0].name}`}
                      />
                    )}
                    {getRepoName[1] == null ? null : (
                      <Card
                        onClick={() =>
                          window.open(getRepoName[1].html_url, "_blank")
                        }
                        color="black"
                        image={`https://github-readme-stats.vercel.app/api/pin/?username=${githubSearch}&repo=${getRepoName[1].name}`}
                      />
                    )}

                    {getRepoName[2] == null ? null : (
                      <Card
                        onClick={() =>
                          window.open(getRepoName[2].html_url, "_blank")
                        }
                        color="blue"
                        image={`https://github-readme-stats.vercel.app/api/pin/?username=${githubSearch}&repo=${getRepoName[2].name}`}
                      />
                    )}

                    {getRepoName[3] == null ? null : (
                      <Card
                        onClick={() =>
                          window.open(getRepoName[3].html_url, "_blank")
                        }
                        color="purple"
                        image={`https://github-readme-stats.vercel.app/api/pin/?username=${githubSearch}&repo=${getRepoName[3].name}`}
                      />
                    )}

                    {getRepoName[4] == null ? null : (
                      <Card
                        onClick={() =>
                          window.open(getRepoName[4].html_url, "_blank")
                        }
                        color="yellow"
                        image={`https://github-readme-stats.vercel.app/api/pin/?username=${githubSearch}&repo=${getRepoName[4].name}`}
                      />
                    )}

                    {getRepoName[5] == null ? null : (
                      <Card
                        onClick={() =>
                          window.open(getRepoName[5].html_url, "_blank")
                        }
                        color="green"
                        image={`https://github-readme-stats.vercel.app/api/pin/?username=${githubSearch}&repo=${getRepoName[5].name}`}
                      />
                    )}
                  </Card.Group>
                  {getRepoName[0] == null ? (
                    <div
                      style={{
                        margin: 20,
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Message info>
                        <Message.Header className="text-25">
                          Oops !
                        </Message.Header>
                        <p style={{ marginTop: 10, fontSize: 14 }}>
                          No Repo found, so no top language either 😔
                        </p>
                      </Message>
                    </div>
                  ) : (
                    <div
                      style={{
                        margin: 20,
                        marginTop: 50,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Card
                        color="teal"
                        image={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubSearch}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <h3
                style={{ marginTop: 80 }}
                class="ui horizontal divider header"
              >
                <i class="clock icon"></i>
                {githubSearch} 's Timeline
              </h3>
              <ul>
                <FlatList
                  list={getEventsData}
                  renderItem={renderEvent}
                  renderWhenEmpty={() => (
                    <div
                      style={{
                        marginTop: 15,
                        display: "flex",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Message info>
                        <Message.Header className="text-25">
                          No Activity 😔
                        </Message.Header>
                      </Message>
                    </div>
                  )}
                />
              </ul>
            </div>
          ) : userStatus == "400" ? (
            <div
              style={{
                margin: 20,
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Message info>
                <Message.Header className="text-25">
                  Server Error !
                </Message.Header>
                <p style={{ marginTop: 10, fontSize: 14 }}>
                  Please try again a few minutes later 😔
                </p>
              </Message>
            </div>
          ) : (
            <div
              style={{
                margin: 20,
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Message info>
                <Message.Header className="text-25">Oops!</Message.Header>
                <p style={{ marginTop: 10 }}>
                  This username is not available on GitHub 😔 Please check it !
                </p>
              </Message>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
