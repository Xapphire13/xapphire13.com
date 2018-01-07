import {Post} from "./post";
import {stripIndent} from "common-tags";

export default <Post[]>[
  {
    id: "foo",
    title: "Test 1",
    created: new Date(2018, 0, 1, 12, 0),
    lastModified: new Date(2018, 0, 1, 12, 0),
    markdownText: "Test",
    tags: ["awesome", "test"]
  },
  {
    id: "bar",
    title: "Test 2",
    created: new Date(2017, 11, 30, 4, 0),
    lastModified: new Date(2018, 0, 5, 12, 0),
    markdownText: stripIndent`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    \`\`\`
    #include <stdio>

    public void main() {
      // Cool stuff

      return 0;
    }
    \`\`\`

    ![cat](http://bit.ly/2xZ9ILS)
    `
  },
  {
    id: "foobar",
    title: "Test 3",
    created: new Date(2017, 11, 29, 18, 0),
    lastModified: new Date(2017, 11, 29, 18, 0),
    markdownText: stripIndent`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    \`\`\`
    #include <stdio>

    public void main() {
      // Cool stuff

      return 0;
    }
    \`\`\`

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae quam cursus,
    vestibulum risus id, mollis neque. Nam sit amet consequat sapien. In ornare lectus in
    purus semper interdum. Morbi aliquam ligula id ex ornare, nec ultrices nulla volutpat.
    Aliquam erat volutpat. Sed tempus leo neque, nec consectetur sapien ornare sit amet.
    Phasellus ut magna nec nulla fringilla sagittis a at dolor. Praesent quis iaculis metus.
    Nunc imperdiet vitae turpis nec pulvinar.
    `
  }
];
