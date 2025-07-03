import Feed from "./Feed";
import "./HomePage.scss";
import Friends from "./Friends";

function HomePage() {
  return (
    <div className="linkup-app">
      <main className="main-content">
        <Feed />
        <Friends />
      </main>
    </div>
  );
}

export default HomePage;
