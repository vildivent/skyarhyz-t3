import type { NextPage } from "next";
import Link from "next/link";
import { authCheck } from "~/utils/authCheck";

export const getServerSideProps = authCheck;

const Requests: NextPage = () => {
  return <Link href="/">Home</Link>;
};

export default Requests;
