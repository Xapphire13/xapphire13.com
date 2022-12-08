import React from "react";
import Footer from "../Footer";
import Header from "../Header";
import PageContent from "../PageContent";

export default function HomePage(): JSX.Element {
  return (
    <>
      <Header />
      <PageContent>Main</PageContent>
      <Footer />
    </>
  );
}
