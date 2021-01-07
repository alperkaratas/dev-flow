import "./App.css";
import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import { Button, Icon, Input, Card, Message, Image } from "semantic-ui-react";
import logo from "./logo.png";
import axios from "axios";

const Home = () => {
  const [githubSearch, setGithubSearch] = useState("");
  const [searchBarText, setSearchBarText] = useState("");
  const [getUserData, setGetUserData] = useState([{}]);
  const githubAvatar = `https://avatars.githubusercontent.com/${githubSearch}`;

  const getUsersData = async () => {
    const response = await axios.get(
      `https://api.github.com/users/${githubSearch}`,
      {
        headers: {
          Authorization: "9b44cf6406e0ef91c3f2d006162719a8722a59e2",
        },
      }
    );
    setGetUserData(response.data);
  };

  const getAllData = () => {
    getUsersData();
    setGithubSearch("alperkaratas");
  };

  useEffect(() => {
    getAllData();
  });

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
                    </Card.Content>
                  </Card>
                </div>

                <Card.Group itemsPerRow={3}>
                  <Card
                    color="red"
                    image={
                      "https://github-readme-stats.vercel.app/api/pin/?username=alperkaratas&repo=find-mentor-mobil"
                    }
                  />
                  <Card
                    color="orange"
                    image={
                      "https://github-readme-stats.vercel.app/api/pin/?username=alperkaratas&repo=find-mentor-mobil"
                    }
                  />
                  <Card
                    color="yellow"
                    image={
                      "https://github-readme-stats.vercel.app/api/pin/?username=alperkaratas&repo=find-mentor-mobil"
                    }
                  />
                  <Card
                    color="olive"
                    image={
                      "https://github-readme-stats.vercel.app/api/pin/?username=alperkaratas&repo=find-mentor-mobil"
                    }
                  />
                  <Card
                    color="green"
                    image={
                      "https://github-readme-stats.vercel.app/api/pin/?username=alperkaratas&repo=find-mentor-mobil"
                    }
                  />
                  <Card
                    color="teal"
                    image={
                      "https://github-readme-stats.vercel.app/api/pin/?username=alperkaratas&repo=find-mentor-mobil"
                    }
                  />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
