"use client";

import "./passport.css";

import Cover from "./Cover";
import PageInfo from "./PageInfo";
import PageCitizen from "./PageCitizen";
import PageQR from "./PageQR";
import PageRights from "./PageRights";
import PageNotes from "./PageNotes";
import PageEnd from "./PageEnd";

import { PassportProps } from "./types";

export default function PassportBook({ passport }: PassportProps) {
  return (
    <div className="passport-book">

      <Cover />

      <PageInfo passport={passport} />

      <PageCitizen passport={passport} />

      <PageQR passport={passport} />

      <PageRights passport={passport} />

      <PageNotes passport={passport} />

      <PageEnd passport={passport} />

    </div>
  );
}