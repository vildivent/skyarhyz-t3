import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

export const authCheck: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const callbackUrl = encodeURIComponent(ctx.resolvedUrl);

  if (!session)
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
      props: {},
    };

  if (session?.user.role !== "ADMIN")
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };

  return { props: { session } };
};
