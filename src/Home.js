import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Button, Icon, Input, Card, Feed } from "semantic-ui-react";
import logo from "./logo.png";

const Home = () => {
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
          onClick={() => window.open("mailto:alpkrts3@gmail.com")}
          color="red"
        >
          <Icon name="mail outline" /> Mail
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginRight: 100, alignItems: "center" }}>
          <Input
            size="big"
            icon="github"
            iconPosition="left"
            placeholder="Search users..."
          />

          <Card className="card-container">
            <Card.Content>
              <Card.Header>Recent Activity</Card.Header>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/jenny.jpg" />
                  <Feed.Content>
                    <Feed.Date content="1 day ago" />
                    <Feed.Summary>
                      You added <a>Jenny Hess</a> to your <a>coworker</a> group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/molly.png" />
                  <Feed.Content>
                    <Feed.Date content="3 days ago" />
                    <Feed.Summary>
                      You added <a>Molly Malone</a> as a friend.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/elliot.jpg" />
                  <Feed.Content>
                    <Feed.Date content="4 days ago" />
                    <Feed.Summary>
                      You added <a>Elliot Baker</a> to your <a>musicians</a>{" "}
                      group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>
          </Card>
        </div>
        <div style={{ marginRight: 100 }}>
          <Input
            size="big"
            icon="medium"
            iconPosition="left"
            placeholder="Search users..."
          />
          <Card className="card-container">
            <Card.Content>
              <Card.Header>Recent Activity</Card.Header>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/jenny.jpg" />
                  <Feed.Content>
                    <Feed.Date content="1 day ago" />
                    <Feed.Summary>
                      You added <a>Jenny Hess</a> to your <a>coworker</a> group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/molly.png" />
                  <Feed.Content>
                    <Feed.Date content="3 days ago" />
                    <Feed.Summary>
                      You added <a>Molly Malone</a> as a friend.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/elliot.jpg" />
                  <Feed.Content>
                    <Feed.Date content="4 days ago" />
                    <Feed.Summary>
                      You added <a>Elliot Baker</a> to your <a>musicians</a>{" "}
                      group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>
          </Card>
        </div>
        <div>
          <Input
            size="big"
            icon="twitter"
            iconPosition="left"
            placeholder="Search users..."
          />
          <Card className="card-container">
            <Card.Content>
              <Card.Header>Recent Activity</Card.Header>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/jenny.jpg" />
                  <Feed.Content>
                    <Feed.Date content="1 day ago" />
                    <Feed.Summary>
                      You added <a>Jenny Hess</a> to your <a>coworker</a> group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/molly.png" />
                  <Feed.Content>
                    <Feed.Date content="3 days ago" />
                    <Feed.Summary>
                      You added <a>Molly Malone</a> as a friend.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event>
                  <Feed.Label image="/images/avatar/small/elliot.jpg" />
                  <Feed.Content>
                    <Feed.Date content="4 days ago" />
                    <Feed.Summary>
                      You added <a>Elliot Baker</a> to your <a>musicians</a>{" "}
                      group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
