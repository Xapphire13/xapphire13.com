import "./styles/app.less";
import "react-github-button/assets/style.less";
import * as React from "react";
import {AppHeader} from "./app-header";
import GitHubButton = require("react-github-button");

export class App extends React.Component {
  public render(): JSX.Element {
    return <div className="app">
      <AppHeader/>
      <div className="app-content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo velit vitae sem tincidunt dignissim.
          Aenean viverra nulla quis condimentum vulputate. Fusce velit risus, ultricies et dui nec, imperdiet vehicula dui.
          Nulla ut ornare mauris. Aliquam consectetur congue lobortis. Donec consectetur tellus ex, quis dignissim neque laoreet non.
          Vivamus porttitor vitae lorem a finibus. Fusce vestibulum cursus commodo. Mauris dapibus vel enim et congue. Aliquam quis facilisis velit.
          Maecenas fermentum nunc eget imperdiet dignissim. Nam porta mi ac erat convallis, non auctor lectus rhoncus.
          Curabitur ornare gravida lobortis. Pellentesque erat elit, rhoncus eget lectus at, laoreet tincidunt leo.
          Vestibulum maximus velit vel nunc posuere fringilla.
        </p>

        <p>
          Sed purus tortor, mattis vitae convallis eget, sagittis non nibh. Nam metus justo, consectetur ultrices venenatis sed,
          vulputate vitae mi. Suspendisse nec nisi fermentum, maximus arcu semper, bibendum est. In hac habitasse platea dictumst.
          Etiam commodo bibendum sollicitudin. Cras varius, sem sit amet tristique laoreet, nunc purus tincidunt lorem, nec aliquam
          dolor quam in odio. Vivamus ultricies sapien sed nibh hendrerit, a faucibus lorem finibus.
        </p>

        <p>
          Fusce lacinia suscipit lacus ac scelerisque. Suspendisse potenti. Ut pretium est sed est aliquam, at efficitur metus placerat.
          Maecenas laoreet ligula quis diam vulputate tristique. Etiam nisi metus, accumsan ut lectus ac, dapibus ultrices est. Phasellus
          dignissim neque quis ipsum luctus scelerisque. Nunc pharetra pulvinar odio nec volutpat. Aliquam pretium imperdiet ultrices.
          Nunc nec erat purus. Sed eros purus, rutrum eget eros a, tristique eleifend nulla. Phasellus vitae eros id eros dapibus porttitor.
          Sed feugiat imperdiet sem non congue. Ut massa dolor, scelerisque eget tristique at, luctus in purus. Vivamus a lacus nibh.
          Donec tincidunt ipsum dolor, eget vulputate ligula molestie vel. Nam sit amet ipsum pharetra, semper dui ut, tempus libero.
        </p>

        <p>
          Phasellus vestibulum sapien in massa scelerisque maximus. Nullam molestie turpis sit amet ante hendrerit condimentum.
          Integer id metus porttitor, congue mauris tristique, vulputate sapien. Donec et libero volutpat dui eleifend posuere.
          Suspendisse mollis tortor turpis, et convallis ipsum elementum at. Vestibulum nec elementum libero. Integer sit amet
          augue scelerisque, congue diam quis, lobortis turpis. Vestibulum eu nisi sem. Donec hendrerit, nibh vel porta dictum,
          metus metus tempor tellus, sit amet hendrerit nulla mi eget urna. Integer at mattis dui, ut condimentum dui.
        </p>

        <p>
          Nulla libero tortor, ornare non fermentum eget, rutrum at nulla. Phasellus ac malesuada dolor. Praesent sed est purus.
          Duis in odio id lectus blandit condimentum. Integer eget massa velit. Pellentesque magna leo, rhoncus vitae nisl ut,
          tristique varius magna. Duis interdum ultricies lacinia. Donec tristique euismod tellus id fringilla. Vivamus libero eros,
          bibendum vitae dignissim sit amet, gravida vitae tellus. Donec eu nibh in ligula sodales pharetra at in arcu. Cras at erat
          in ex vulputate iaculis. Sed non erat ornare, fermentum justo non, blandit turpis. Phasellus fermentum, nunc sagittis cursus
          tristique, odio enim tristique est, eget mollis odio ligula vel justo. Nullam id magna quis nisi porta consequat in laoreet
          nisl. In a erat nec diam imperdiet cursus in sed dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia Curae;
        </p>
      </div>
      <footer className="app-footer">
        <GitHubButton type="forks" size="large" namespace="xapphire13" repo="xapphire13.com" />
      </footer>
    </div>;
  }
}
