import "./styles/home-page.less";
import * as React from "react";
import {PostPreview} from "./post-preview";
import MP from "./mock-posts";
import throttle = require("throttleit");

const MAX_PREVIEW_LENGTH = 4000;
const MOCK_POSTS = new Array(20).fill(null).reduce<string[]>(p => p.concat(...MP), []);

type State = {
  loading: boolean;
  loadedPosts: any[];
};

export class HomePage extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      loadedPosts: []
    };
  }

  public componentDidMount(): void {
    window.addEventListener("scroll", this.onScroll)
    this.loadPosts();
  }

  public componentWillUnmount(): void {
    window.removeEventListener("scroll", this.onScroll);
  }

  public render(): JSX.Element {
    return <div className={`home-page${this.state.loading ? " loading" : ""}`}>
      {this.state.loadedPosts.map((post, i) =>
        <PostPreview
          key={i}
          title="Test"
          created={new Date()}
          lastModified={new Date()}
          markdownText={post}
          tags={["Test", "tech", "awesome"]}
          maxLength={MAX_PREVIEW_LENGTH} />)}
    </div>;
  }

  private loadPosts(): void {
    const {loadedPosts} = this.state;
    this.setState({
      loading: true
    });

    for (
      let i = loadedPosts.length, c = 3;
      loadedPosts.length < MOCK_POSTS.length && c;
      c--, i++) {
      loadedPosts.push(MOCK_POSTS[i]);
    }

    this.setState({
      loadedPosts,
      loading: false
    });
  }

  private onScroll = throttle(() => {
    const app = document.getElementById("app")!;
    if (window.innerHeight + window.scrollY + 200 >= app.offsetHeight) {
      this.loadPosts();
    }
  }, 500);
}
