import React from "react";
import { NavBar } from "./_components/navbar";
import { SideBar } from "./_components/sidebar";
import { Container } from "./_components/container";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
        <NavBar/>
      <div className="flex h-full pt-20">
        <SideBar/>
        <Container>
        {children}
        </Container>
      </div>
    </>
  );
};

export default BrowseLayout;
