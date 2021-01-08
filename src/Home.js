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
  Header,
} from "semantic-ui-react";
import logo from "./logo.png";
import axios from "axios";

const Home = () => {
  const [githubSearch, setGithubSearch] = useState("");
  const [searchBarText, setSearchBarText] = useState("");
  const [getUserData, setGetUserData] = useState([{}]);
  const [getRepoName, setGetRepoName] = useState([{}]);
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

  const getAllData = () => {
    getUsersData();
    getRepo();
    setGithubSearch("ezranbayantemur");
    console.log(getRepoName.name);
  };
  {
    /*useEffect(() => {
    getAllData();
  });*/
  }

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
          {githubSearch === "" ? (
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
                  to see and review it :)
                </p>
              </Message>
            </div>
          ) : (
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
                          <Button
                            onClick={() =>
                              window.open(
                                `https://twitter.com/${getUserData.twitter_username}`,
                                "_blank"
                              )
                            }
                            color="twitter"
                          >
                            <Icon name="twitter" />{" "}
                            {getUserData.twitter_username}
                          </Button>
                        </Card.Description>
                      )}
                    </Card.Content>
                  </Card>
                </div>
                <Card.Group itemsPerRow={3}>
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
              </div>
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

              <h2 style={{marginTop: 80}} class="ui horizontal divider header">
                <i class="clock icon"></i>
                {githubSearch} 's Timeline
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
