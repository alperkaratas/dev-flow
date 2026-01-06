/* eslint-disable no-restricted-globals */
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import React, { useState } from "react";
import {
  Button,
  Icon,
  Input,
  Card,
  Message,
  Feed,
  Divider,
  Popup,
} from "semantic-ui-react";
import logo from "./logo.png";
import axios from "axios";
import moment from "moment";
import FlatList from "flatlist-react";

const Home = () => {
  const [githubSearch, setGithubSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [getUserData, setGetUserData] = useState([{}]);
  const [userStatus, setUserStatus] = useState("400");
  const [getRepoName, setGetRepoName] = useState([{}]);
  const [getEventsData, setGetEventsData] = useState([]);
  const [statsImageError, setStatsImageError] = useState(false);
  const [graphImageError, setGraphImageError] = useState(false);
  const [statsImageUrl, setStatsImageUrl] = useState('');
  const [graphImageUrl, setGraphImageUrl] = useState('');
  const [starredRepos, setStarredRepos] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [gists, setGists] = useState([]);
  const [repoStats, setRepoStats] = useState({ totalStars: 0, totalForks: 0, totalWatchers: 0 });
  const [pinnedRepos, setPinnedRepos] = useState([]);

  const githubAvatar = `https://avatars.githubusercontent.com/${githubSearch}`;

  // GitHub API için axios instance oluştur (timeout ve token desteği ile)
  const githubApi = axios.create({
    baseURL: "https://api.github.com",
    timeout: 10000, // 10 saniye timeout
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  // Opsiyonel: GitHub token'ı environment variable'dan al
  // Token kullanmak için: REACT_APP_GITHUB_TOKEN=your_token_here
  const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
  if (githubToken) {
    githubApi.defaults.headers.common["Authorization"] = `token ${githubToken}`;
  }

  const getUsersData = async (username) => {
    if (!username || username.trim() === "") {
      setUserStatus("400");
      return;
    }
    try {
      const response = await githubApi.get(`/users/${username}`);
      setGetUserData(response.data);
      setUserStatus(response.status.toString());
    } catch (error) {
      if (error.response) {
        setUserStatus(error.response.status.toString());
      } else if (error.code === "ECONNABORTED") {
        setUserStatus("408"); // Timeout
      } else {
        setUserStatus("400");
      }
    }
  };

  const getRepo = async (username) => {
    if (!username || username.trim() === "") {
      setGetRepoName([]);
      return;
    }
    try {
      const response = await githubApi.get(`/users/${username}/repos?sort=updated&per_page=100`);
      setGetRepoName(response.data);
      calculateRepoStats(response.data);
      // Repolar yüklendikten sonra pinned repos'ları kontrol et
      getPinnedRepos(username, response.data);
    } catch (error) {
      setGetRepoName([]);
      calculateRepoStats([]);
    }
  };

  const getEventData = async (username) => {
    if (!username || username.trim() === "") {
      setGetEventsData([]);
      return;
    }
    try {
      const response1 = await githubApi.get(`/users/${username}/events`);
      setGetEventsData(response1.data);
    } catch (error) {
      setGetEventsData([]);
    }
  };

  const getStarredRepos = async (username) => {
    if (!username || username.trim() === "") {
      setStarredRepos([]);
      return;
    }
    try {
      const response = await githubApi.get(`/users/${username}/starred?per_page=5`);
      setStarredRepos(response.data);
    } catch (error) {
      setStarredRepos([]);
    }
  };

  const getOrganizations = async (username) => {
    if (!username || username.trim() === "") {
      setOrganizations([]);
      return;
    }
    try {
      const response = await githubApi.get(`/users/${username}/orgs`);
      setOrganizations(response.data);
    } catch (error) {
      setOrganizations([]);
    }
  };

  const getGists = async (username) => {
    if (!username || username.trim() === "") {
      setGists([]);
      return;
    }
    try {
      const response = await githubApi.get(`/users/${username}/gists?per_page=5`);
      setGists(response.data);
    } catch (error) {
      setGists([]);
    }
  };

  const calculateRepoStats = (repos) => {
    if (!repos || repos.length === 0) {
      setRepoStats({ totalStars: 0, totalForks: 0, totalWatchers: 0 });
      return;
    }
    const stats = repos.reduce((acc, repo) => {
      acc.totalStars += repo.stargazers_count || 0;
      acc.totalForks += repo.forks_count || 0;
      acc.totalWatchers += repo.watchers_count || 0;
      return acc;
    }, { totalStars: 0, totalForks: 0, totalWatchers: 0 });
    setRepoStats(stats);
  };

  const getPinnedRepos = async (username, reposList = []) => {
    if (!username || username.trim() === "") {
      setPinnedRepos([]);
      return;
    }
    try {
      // GitHub GraphQL API kullanarak pinned repos'ları al
      const query = {
        query: `
          query {
            user(login: "${username}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    url
                    stargazerCount
                    forkCount
                    primaryLanguage {
                      name
                    }
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
        `
      };

      const response = await axios.post('https://api.github.com/graphql', query, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': githubToken ? `token ${githubToken}` : undefined,
        },
        timeout: 10000,
      });

      if (response.data?.data?.user?.pinnedItems?.nodes && response.data.data.user.pinnedItems.nodes.length > 0) {
        const pinned = response.data.data.user.pinnedItems.nodes.map(node => ({
          id: node.name,
          name: node.name,
          full_name: `${node.owner.login}/${node.name}`,
          description: node.description,
          html_url: node.url,
          stargazers_count: node.stargazerCount,
          forks_count: node.forkCount,
          language: node.primaryLanguage?.name || null,
          owner: { login: node.owner.login }
        }));
        setPinnedRepos(pinned);
      } else {
        // Pinned repos yoksa, en popüler repoları göster
        if (reposList.length > 0) {
          const sortedRepos = [...reposList].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
          setPinnedRepos(sortedRepos.slice(0, 6));
        }
      }
    } catch (error) {
      // GraphQL başarısız olursa, en popüler repoları göster
      if (reposList.length > 0) {
        const sortedRepos = [...reposList].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
        setPinnedRepos(sortedRepos.slice(0, 6));
      }
    }
  };

  const getAllData = () => {
    const username = searchText.trim();
    if (!username) {
      setUserStatus("400");
      return;
    }
    // Önce state'i güncelle, sonra API çağrılarını yap
    setGithubSearch(username);
    // Görsel hatalarını ve URL'leri sıfırla
    setStatsImageError(false);
    setGraphImageError(false);
    setStatsImageUrl('');
    setGraphImageUrl('');
    // API çağrılarını username parametresi ile yap
    getUsersData(username);
    getRepo(username); // getRepo içinde getPinnedRepos çağrılıyor
    getEventData(username);
    getStarredRepos(username);
    getOrganizations(username);
    getGists(username);
  };

  const renderEvent = (item) => {
    const navigateRepo = `https://github.com/${item.repo.name}`;
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20, padding: '0 10px' }}>
        <Feed style={{ width: '100%', maxWidth: '100%' }}>
          <Feed.Event>
            <Feed.Label>
              <img src={githubAvatar} alt="User avatar" className="github-avatar-feed" />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>{getUserData.name}</Feed.User> {item.type}
              </Feed.Summary>
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="linkify" />{" "}
                  <a href={navigateRepo} target="_blank" rel="noopener noreferrer">
                    {item.repo.name}
                  </a>
                </Feed.Like>
                <Feed.Extra>
                  Action:{" "}
                  {item.payload.action == null ? "pushed" : item.payload.action}{" "}
                  @{moment(item.created_at).format("Do MMM YYYY")}
                </Feed.Extra>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
          <Divider className="divider-a" />
        </Feed>
      </div>
    );
  };

  // GitHub Stats ve Graph URL'leri - Alternatif API'ler
  // GitHub Stats için alternatifler:
  // 1. github-profile-summary-cards (önerilen)
  // 2. awesome-github-stats  
  // 3. github-readme-stats (farklı instance)
  
  // GitHub Graph için alternatifler:
  // 1. github-contributions-viewer
  // 2. github-readme-activity-graph
  
  // GitHub Stats ve Graph için alternatif API'ler
  const githubStatsOptions = githubSearch ? [
    `https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${githubSearch}&theme=default`,
    `https://github-readme-stats.vercel.app/api?username=${githubSearch}&show_icons=true&theme=default&hide_border=true`,
    `https://awesome-github-stats.vercel.app/api?username=${githubSearch}&show_icons=true&theme=radical`
  ] : [];
  
  const githubGraphOptions = githubSearch ? [
    `https://github-contributions.vercel.app/api/v1/${githubSearch}?format=svg`,
    `https://github-readme-activity-graph.vercel.app/graph?username=${githubSearch}&theme=github`,
    `https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${githubSearch}&theme=default`
  ] : [];
  
  // İlk seçenekleri varsayılan olarak ayarla
  const githubStats = githubStatsOptions.length > 0 ? githubStatsOptions[0] : '';
  const githubGraph = githubGraphOptions.length > 0 ? githubGraphOptions[0] : '';
  
  return (
    <div className="App">
      <div className="App-logo">
        <img width={90} height={90} src={logo} alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
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
        <div style={{ marginTop: 2, width: '100%', textAlign: 'center' }}>
          <a
            href="https://www.producthunt.com/posts/dev-flow?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dev-flow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=280541&theme=dark"
              alt="dev-flow - View GitHub statistics and timeline by username. | Product Hunt"
              className="product-hunt-badge"
              width="250"
              height="54"
            />
          </a>
        </div>
      </div>
      <div style={{ marginTop: 13, marginBottom: 13, padding: '0 10px' }}>
        <p style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>
          Created by{" "}
          <a
            href="https://github.com/alperkaratas"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            @alperkaratas
          </a>
          {", "}
          @January / 2021 🎉
        </p>
      </div>
      <div className="main-content-wrapper">
        <div className="content-section">
          <div className="search-button">
            <div className="search-input-container">
              <Input
                size="big"
                icon="github"
                iconPosition="left"
                placeholder="Search username..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    getAllData();
                  }
                }}
                fluid
              />
            </div>
            <div style={{ marginLeft: 5, marginTop: '10px' }}>
              <Popup
                content="👉 Search User"
                trigger={
                  <Button onClick={() => getAllData()} circular icon="search" />
                }
              />
            </div>
          </div>
          {githubSearch === "" && userStatus !== "200" ? (
            <div
              style={{
                margin: 20,
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
                padding: '0 10px',
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
                <p style={{ marginTop: 10 }}>
                  👉 Enter the username in the search box
                </p>
              </Message>
            </div>
          ) : userStatus === "200" ? (
            <div>
              <div style={{ margin: 20, marginTop: 50, padding: '0 10px' }}>
                <div className="user-card-container">
                  <Card style={{ maxWidth: '100%', width: '100%' }}>
                    <div className="github-avatar-wrapper">
                      <img src={githubAvatar} alt={githubSearch} className="github-avatar" />
                    </div>
                    <Card.Content>
                      <Card.Header>👤 {githubSearch}</Card.Header>
                      <Card.Meta>
                        <span className="date">✨ {getUserData.name}</span>
                      </Card.Meta>
                      {getUserData.bio && (
                        <Card.Description>📝 {getUserData.bio}</Card.Description>
                      )}
                      {getUserData.location && (
                        <Card.Description className="user-location">
                          📍 {getUserData.location}
                        </Card.Description>
                      )}
                      {getUserData.company == null ? null : (
                        <Card.Description>
                          🏢 {getUserData.company}
                        </Card.Description>
                      )}
                      <Card.Description style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {getUserData.followers !== undefined && (
                          <span>
                            <Icon name="users" /> <strong>{getUserData.followers}</strong> Followers
                          </span>
                        )}
                        {getUserData.following !== undefined && (
                          <span>
                            <Icon name="user plus" /> <strong>{getUserData.following}</strong> Following
                          </span>
                        )}
                        {getUserData.public_repos !== undefined && (
                          <span>
                            <Icon name="code" /> <strong>{getUserData.public_repos}</strong> Repos
                          </span>
                        )}
                      </Card.Description>
                      {repoStats.totalStars > 0 && (
                        <Card.Description style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', fontSize: '0.9em' }}>
                          <span>⭐ <strong>{repoStats.totalStars}</strong> Stars</span>
                          <span>🍴 <strong>{repoStats.totalForks}</strong> Forks</span>
                          <span>👀 <strong>{repoStats.totalWatchers}</strong> Watchers</span>
                        </Card.Description>
                      )}
                      {organizations.length > 0 && (
                        <Card.Description style={{ marginTop: '10px' }}>
                          <Icon name="sitemap" /> Organizations: {organizations.map((org, idx) => (
                            <span key={org.id}>
                              <a 
                                href={org.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ marginLeft: '5px', textDecoration: 'underline' }}
                              >
                                {org.login}
                              </a>
                              {idx < organizations.length - 1 && ', '}
                            </span>
                          ))}
                        </Card.Description>
                      )}
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
                            className="circular ui icon button"
                          >
                            <i className="icon twitter" color="twitter"></i>
                          </button>
                          <button
                            onClick={() =>
                              window.open(
                                `https://github.com/${githubSearch}`,
                                "_blank"
                              )
                            }
                            className="circular ui icon button"
                          >
                            <i className="icon github" color="github"></i>
                          </button>
                        </Card.Description>
                      )}
                    </Card.Content>
                  </Card>
                </div>
                {githubStats && (
                  <div style={{ marginTop: 15, padding: '0 10px' }}>
                    <img 
                      src={statsImageUrl || githubStats} 
                      className="responsive-stats-image" 
                      alt="GitHub Stats"
                      onError={(e) => {
                        const currentIndex = githubStatsOptions.findIndex(url => url === (statsImageUrl || githubStats));
                        if (currentIndex < githubStatsOptions.length - 1) {
                          // Bir sonraki alternatifi dene
                          setStatsImageUrl(githubStatsOptions[currentIndex + 1]);
                        } else {
                          setStatsImageError(true);
                        }
                      }}
                      onLoad={() => {
                        setStatsImageError(false);
                      }}
                    />
                  </div>
                )}
                {statsImageError && (
                  <div style={{ marginTop: 15, padding: '0 10px', textAlign: 'center', color: '#999' }}>
                    📊 GitHub Stats görseli yüklenemedi
                  </div>
                )}
                {githubGraph && (
                  <div style={{ marginTop: 30, padding: '0 10px' }}>
                    <img 
                      src={graphImageUrl || githubGraph} 
                      className="responsive-graph-image" 
                      alt="GitHub Graph"
                      onError={(e) => {
                        const currentIndex = githubGraphOptions.findIndex(url => url === (graphImageUrl || githubGraph));
                        if (currentIndex < githubGraphOptions.length - 1) {
                          // Bir sonraki alternatifi dene
                          setGraphImageUrl(githubGraphOptions[currentIndex + 1]);
                        } else {
                          setGraphImageError(true);
                        }
                      }}
                      onLoad={() => {
                        setGraphImageError(false);
                      }}
                    />
                  </div>
                )}
                {graphImageError && (
                  <div style={{ marginTop: 30, padding: '0 10px', textAlign: 'center', color: '#999' }}>
                    📈 GitHub Graph görseli yüklenemedi
                  </div>
                )}
                <div style={{ marginTop: 20, marginBottom: 20, padding: '0 10px' }}>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=Hey!%20You%20can%20see%20my%20GitHub%20summary%20here%20(search word: ${githubSearch}) 👉 &url=https://dev-flow.netlify.app/`,
                        "_blank"
                      )
                    }
                    color="twitter"
                    fluid
                    style={{ maxWidth: '400px', margin: '0 auto' }}
                  >
                    <Icon name="twitter" /> Share on Twitter
                  </Button>
                </div>
                <div>
                  {(pinnedRepos.length > 0 || getRepoName.length > 0) && (
                    <Card.Group className="repos-container" itemsPerRow={3} stackable>
                      {(pinnedRepos.length > 0 ? pinnedRepos : getRepoName.slice(0, 6)).map((repo, index) => {
                        const colors = ['red', 'black', 'blue', 'purple', 'yellow', 'green'];
                        const color = colors[index % colors.length];
                        return (
                          <Card
                            key={repo.id || repo.name || index}
                            onClick={() => window.open(repo.html_url, "_blank")}
                            color={color}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Content>
                              <Card.Header>{repo.name}</Card.Header>
                              <Card.Meta>
                                <span>{repo.owner?.login || repo.full_name?.split('/')[0]}</span>
                              </Card.Meta>
                              <Card.Description>
                                {repo.description || 'No description'}
                              </Card.Description>
                              <Card.Description style={{ marginTop: '10px', fontSize: '0.9em' }}>
                                ⭐ {repo.stargazers_count || 0} | 🍴 {repo.forks_count || 0} | {repo.language || 'N/A'}
                              </Card.Description>
                            </Card.Content>
                          </Card>
                        );
                      })}
                    </Card.Group>
                  )}
                  {getRepoName[0] == null ? null : (
                    <div style={{ marginTop: 15, padding: '0 10px' }}>
                      <Button
                        onClick={() =>
                          window.open(
                            `https://github.com/${githubSearch}?tab=repositories`,
                            "_blank"
                          )
                        }
                        color="black"
                        fluid
                        style={{ maxWidth: '400px', margin: '0 auto' }}
                      >
                        <Icon name="github" /> See all of {githubSearch}'s repos
                      </Button>
                    </div>
                  )}

                  {/* {getRepoName[0] == null ? (
                    <div
                      style={{
                        margin: 20,
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                        padding: '0 10px',
                      }}
                    >
                      <Message info>
                        <Message.Header className="text-25">
                          Oops ❗️
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
                        padding: '0 10px',
                      }}
                    >
                      <Card
                        color="teal"
                        image={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubSearch}`}
                        style={{ maxWidth: '100%', width: '100%' }}
                      />
                    </div>
                  )} */}
                </div>
              </div>

              {starredRepos.length > 0 && (
                <>
                  <h2
                    style={{ marginTop: 80, padding: '0 10px' }}
                    className="ui horizontal divider header"
                  >
                    <i className="star icon"></i>
                    Starred Repositories
                  </h2>
                  <div style={{ padding: '0 10px', marginTop: '20px' }}>
                    <Card.Group itemsPerRow={3} stackable>
                      {starredRepos.slice(0, 6).map((repo) => (
                        <Card
                          key={repo.id}
                          onClick={() => window.open(repo.html_url, "_blank")}
                          color="yellow"
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Content>
                            <Card.Header>{repo.name}</Card.Header>
                            <Card.Meta>
                              <span>{repo.owner.login}</span>
                            </Card.Meta>
                            <Card.Description>
                              {repo.description || 'No description'}
                            </Card.Description>
                            <Card.Description style={{ marginTop: '10px', fontSize: '0.9em' }}>
                              ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | {repo.language || 'N/A'}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      ))}
                    </Card.Group>
                  </div>
                </>
              )}

              {gists.length > 0 && (
                <>
                  <h2
                    style={{ marginTop: 80, padding: '0 10px' }}
                    className="ui horizontal divider header"
                  >
                    <i className="code icon"></i>
                    Recent Gists
                  </h2>
                  <div style={{ padding: '0 10px', marginTop: '20px' }}>
                    <Card.Group itemsPerRow={2} stackable>
                      {gists.slice(0, 4).map((gist) => (
                        <Card
                          key={gist.id}
                          onClick={() => window.open(gist.html_url, "_blank")}
                          color="blue"
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Content>
                            <Card.Header>
                              {gist.description || gist.files[Object.keys(gist.files)[0]]?.filename || 'Untitled Gist'}
                            </Card.Header>
                            <Card.Meta>
                              <span>{Object.keys(gist.files).length} file(s)</span>
                            </Card.Meta>
                            <Card.Description>
                              Created: {moment(gist.created_at).format("MMM Do YYYY")}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      ))}
                    </Card.Group>
                  </div>
                </>
              )}

              <h2
                style={{ marginTop: 80, padding: '0 10px' }}
                className="ui horizontal divider header"
              >
                <i className="clock icon"></i>
                {githubSearch} 's GitHub Timeline
              </h2>
              <ul style={{ padding: '0 10px' }}>
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
                        padding: '0 10px',
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
          ) : userStatus === "400" ? (
            <div
              style={{
                margin: 20,
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
                padding: '0 10px',
              }}
            >
              <Message info>
                <Message.Header className="text-25">
                  Server Error ❗️
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
                padding: '0 10px',
              }}
            >
              <Message info>
                <Message.Header className="text-25">Oops ❗️</Message.Header>
                <p style={{ marginTop: 10 }}>
                  This username is not available on GitHub 😔 Please check it
                  ❗️
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
